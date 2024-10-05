use hex;
use keyring::{Credential, CredentialBuilder, Entry};
use ring::aead;
use ring::aead::{Aad, LessSafeKey, Nonce, UnboundKey, NONCE_LEN};
use ring::rand::{SecureRandom, SystemRandom};
use secrecy::{ExposeSecret, SecretBox, SecretString};
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;
use std::str::FromStr;
use tauri::path::BaseDirectory::AppLocalData;
use tauri::{
    plugin::{Builder, TauriPlugin},
    Manager, Runtime, Url,
};

// OAuth Module
mod itslearning {
    use serde::{Deserialize, Serialize};

    pub const SCHEME: &str = "itsl-itslearning";
    pub const CLIENT_ID: &str = "10ae9d30-1853-48ff-81cb-47b58a325685";
    pub const AUTH_TOKEN_URL: &str = "https://sdu.itslearning.com/restapi/oauth2/token";
    pub const AUTH_LOGIN_URL: &str = "https://sdu.itslearning.com/restapi/oauth2/authorize";
    pub const AUTH_REDIRECT_URL_PARAMS: [(&str, &str); 4] = [
        ("response_type", "code"),
        ("client_id", CLIENT_ID),
        ("redirect_uri", "itsl-itslearning://login"),
        ("scope", "SCOPE"),
    ];

    #[derive(Deserialize, Debug)]
    pub struct AuthCallbackQuery {
        pub state: String,
        pub code: String,
    }

    #[derive(Deserialize, Debug, Serialize)]
    pub struct AuthCallbackResponse {
        pub access_token: String,
        pub token_type: String,
        pub expires_in: u64,
        pub refresh_token: String,
    }

    pub enum GrantType {
        AuthorizationCode,
        RefreshToken,
    }

    impl GrantType {
        pub fn as_str(&self) -> &'static str {
            match self {
                GrantType::AuthorizationCode => "authorization_code",
                GrantType::RefreshToken => "refresh_token",
            }
        }
    }

    pub fn redirect_uri() -> String {
        format!("{}://login", SCHEME)
    }

    pub fn auth_url() -> String {
        let mut url = reqwest::Url::parse(AUTH_LOGIN_URL).expect("Failed to parse URL");
        for (key, value) in AUTH_REDIRECT_URL_PARAMS.iter() {
            url.query_pairs_mut().append_pair(key, value);
        }
        url.to_string()
    }
}

#[derive(Deserialize, Serialize)]
struct Tokens {
    access_token: String,
    refresh_token: String,
}

const KEYRING_SERVICE: &str = "ITSL_OAUTH";
// const KEYRING_ACCOUNT: &str = "encryption_key";
const KEYRING_ACCOUNT: &str = "encryption_key";

// Key Management
fn get_encryption_key() -> SecretBox<[u8; 32]> {
    // Create a new keyring entry
    let entry = match Entry::new(KEYRING_SERVICE, KEYRING_ACCOUNT) {
        Ok(e) => e,
        Err(e) => panic!("Error creating keyring entry: {}", e),
    };

    // Attempt to retrieve the password (encryption key) from the keyring
    match entry.get_password() {
        Ok(key_hex) => {
            println!("Retrieved encryption key from keyring.");
            // Decode the hex string to bytes
            let key_bytes = hex::decode(key_hex).expect("Decoding failed");
            // Convert the byte vector to a fixed-size array
            let key_array: [u8; 32] = key_bytes
                .as_slice()
                .try_into()
                .expect("Key has incorrect length");

            // Wrap the key in a SecretBox for secure handling
            SecretBox::new(Box::new(key_array))
        }
        Err(_) => {
            // If no key is found, generate a new 256-bit (32-byte) key
            let rng = SystemRandom::new();
            let mut key = [0u8; 32];
            rng.fill(&mut key).expect("Failed to generate key");

            // Encode the key as a hex string for storage
            let key_hex = hex::encode(&key);

            // Store the hex-encoded key in the keyring
            entry
                .set_password(&key_hex)
                .expect("Failed to store key in keyring");

            println!("Generated and stored a new encryption key.");

            // Wrap the new key in a SecretBox
            SecretBox::new(Box::new(key))
        }
    }
}

// Encryption Function
fn encrypt_tokens(tokens: &Tokens) -> Vec<u8> {
    let key = get_encryption_key();
    let unbound_key = UnboundKey::new(&aead::AES_256_GCM, key.expose_secret())
        .expect("Failed to create UnboundKey");
    let less_safe_key = LessSafeKey::new(unbound_key);

    // Serialize tokens to JSON
    let serialized = serde_json::to_vec(tokens).expect("Serialization failed");

    // Generate a unique nonce for each encryption
    let mut nonce_bytes = [0u8; NONCE_LEN];
    let rng = SystemRandom::new();
    rng.fill(&mut nonce_bytes)
        .expect("Failed to generate nonce");
    let nonce = Nonce::assume_unique_for_key(nonce_bytes);

    // Prepare the buffer with the serialized data
    let mut in_out = serialized.clone();

    // Encrypt the data, appending the tag to in_out
    less_safe_key
        .seal_in_place_append_tag(nonce, Aad::empty(), &mut in_out)
        .expect("Encryption failed");

    // Prepend nonce to ciphertext (which now includes the tag)
    [nonce_bytes.to_vec(), in_out].concat()
}

// Decryption Function
fn decrypt_tokens(encrypted_data: &[u8]) -> Option<Tokens> {
    if encrypted_data.len() < NONCE_LEN {
        println!("Encrypted data is too short.");
        return None; // Invalid data
    }

    let key = get_encryption_key();

    let unbound_key = UnboundKey::new(&aead::AES_256_GCM, key.expose_secret())
        .expect("Failed to create UnboundKey");
    let less_safe_key = LessSafeKey::new(unbound_key);

    // Split nonce and ciphertext
    let (nonce_bytes, ciphertext) = encrypted_data.split_at(NONCE_LEN);
    let nonce = match Nonce::try_assume_unique_for_key(nonce_bytes) {
        Ok(n) => n,
        Err(e) => {
            println!("Invalid nonce: {:?}", e);
            return None;
        }
    };

    // Decrypt the data
    let mut in_out = ciphertext.to_vec();
    match less_safe_key.open_in_place(nonce, Aad::empty(), &mut in_out) {
        Ok(decrypted_data) => {
            // Deserialize JSON back to Tokens
            match serde_json::from_slice(decrypted_data) {
                Ok(tokens) => Some(tokens),
                Err(e) => {
                    println!("Deserialization error: {:?}", e);
                    None
                }
            }
        }
        Err(e) => {
            println!("Decryption error: {:?}", e);
            None
        }
    }
}

const TOKENS_FILE_NAME: &str = "tokens.enc";

// Storage Path
fn get_tokens_file_path<R: tauri::Runtime>(
    app_path: &tauri::path::PathResolver<R>,
) -> Result<PathBuf, Box<dyn std::error::Error>> {
    let local_app_data = app_path
        .app_local_data_dir()
        .expect("Failed to get local app data dir");
    Ok(local_app_data.join(TOKENS_FILE_NAME))
}

/// Saves the encrypted tokens to a file.
fn save_tokens<R: tauri::Runtime>(
    tokens: &Tokens,
    app_path: &tauri::path::PathResolver<R>,
) -> Result<(), Box<dyn std::error::Error>> {
    // Encrypt the tokens
    let encrypted_tokens = encrypt_tokens(tokens);

    // Determine the file path where tokens will be saved
    let path = get_tokens_file_path(app_path)?;

    // Write the serialized tokens to the file
    fs::write(&path, encrypted_tokens)?;

    println!("Tokens have been encrypted and saved to {:?}", path);
    Ok(())
}

/// Retrieves and decrypts the tokens from the file.
fn get_tokens<R: tauri::Runtime>(
    app_path: &tauri::path::PathResolver<R>,
) -> Result<Tokens, Box<dyn std::error::Error>> {
    // Retrieve the path to the tokens file
    let path = get_tokens_file_path(app_path)?;

    // Check if the tokens file exists
    if !path.exists() {
        return Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::NotFound,
            format!("Tokens file does not exist at {:?}", path),
        )));
    }

    // Read the encrypted data from the file
    let encrypted_data = fs::read(&path)?; // Use `?` to propagate errors instead of `expect`

    // Decrypt the tokens
    let tokens = decrypt_tokens(&encrypted_data); // Propagate decryption errors

    match tokens {
        Some(tokens) => {
            println!("Tokens have been decrypted and retrieved from {:?}", path);
            Ok(tokens)
        }
        None => Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::InvalidData,
            "Failed to decrypt tokens",
        ))),
    }
}

// OAuth Handling
pub async fn handle_itslearning_auth_callback(
    url: String,
) -> Result<itslearning::AuthCallbackResponse, Box<dyn std::error::Error>> {
    println!("URL: {}", url);

    let url = Url::try_from(url.as_str())?;

    if let Some(query) = url.query() {
        let auth_query: itslearning::AuthCallbackQuery = serde_qs::from_str(query)?;

        let params = [
            (
                "grant_type",
                itslearning::GrantType::AuthorizationCode.as_str(),
            ),
            ("code", &auth_query.code),
            ("client_id", itslearning::CLIENT_ID),
        ];

        let client = reqwest::Client::new();
        let res = client
            .post(itslearning::AUTH_TOKEN_URL)
            .form(&params)
            .send()
            .await?;

        match res.status().is_success() {
            true => Ok(res.json::<itslearning::AuthCallbackResponse>().await?),
            false => Err(Box::new(std::io::Error::new(
                std::io::ErrorKind::Other,
                format!("Failed to get auth token: {}", res.status()),
            ))),
        }
    } else {
        Err(Box::new(std::io::Error::new(
            std::io::ErrorKind::InvalidInput,
            "No query parameters found in URL",
        )))
    }
}

// Tauri Plugin Initialization
pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::<R>::new("itsl-oauth")
        .setup(|app, _api| {
            let config = app.config().plugins.0.get("deep-link");
            let desktop = config.unwrap().get("desktop").unwrap().as_object().unwrap();
            let desktop_schemes = desktop.get("schemes").unwrap().as_array().unwrap();
            println!("schemes: {:?}", desktop_schemes);
            Ok(())
        })
        .on_navigation(|webview, url| {
            println!("URL: {}", url);

            let mut webview_clone = webview.clone();

            match get_tokens(&webview_clone.path()) {
                Ok(tokens) => {
                    println!("Tokens have been retrieved from file.");
                    println!("Access token: {:?}", tokens.access_token);
                    println!("Refresh token: {:?}", tokens.refresh_token);
                    // if let Err(e) = webview_clone
                    //     .navigate(Url::parse("http://localhost:1420").expect("Failed to parse URL"))
                    // {
                    //     eprintln!("Navigation error: {}", e);
                    // }
                }
                Err(e) => {
                    eprintln!("Error retrieving tokens: {}", e);
                    // webview_clone.navigate(
                    //     Url::parse(itslearning::auth_url().as_str()).expect("Failed to parse URL"),
                    // );
                }
            }

            let url_string = String::from(url.as_str());
            tauri::async_runtime::spawn(async move {
                if !url_string.starts_with(itslearning::SCHEME) {
                    return;
                }

                match handle_itslearning_auth_callback(url_string).await {
                    Ok(response) => {
                        println!("Auth response: {:?}", response);
                        let tokens = Tokens {
                            access_token: response.access_token,
                            refresh_token: response.refresh_token,
                        };
                        // Retrieve the PathResolver
                        let path_resolver = webview_clone.path();
                        // Save the tokens
                        if let Err(e) = save_tokens(&tokens, &path_resolver) {
                            eprintln!("Failed to save tokens: {}", e);
                        } else {
                            println!("Tokens have been successfully saved.");
                        }
                        if let Err(e) = webview_clone.navigate(
                            Url::parse("http://localhost:1420").expect("Failed to parse URL"),
                        ) {
                            eprintln!("Navigation error: {}", e);
                        }
                    }
                    Err(e) => {
                        eprintln!("Error handling auth callback: {}", e);
                        if let Err(e) = webview_clone.navigate(
                            Url::parse(itslearning::redirect_uri().as_str())
                                .expect("Failed to parse URL"),
                        ) {
                            eprintln!("Navigation error: {}", e);
                        }
                    }
                }
            });

            url.scheme() != itslearning::SCHEME
        })
        .build()
}
