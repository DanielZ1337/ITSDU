use tauri::{
    plugin::{Builder, TauriPlugin},
    Runtime, Url,
};

mod itslearning {
    use serde::Deserialize;

    pub const SCHEME: &str = "itsl-itslearning";
    pub const CLIENT_ID: &str = "10ae9d30-1853-48ff-81cb-47b58a325685";
    pub const AUTH_TOKEN_URL: &str = "https://sdu.itslearning.com/restapi/oauth2/token";
    pub const AUTH_REDIRECT_URL: &str = "https://sdu.itslearning.com/restapi/oauth2/authorize";
    pub const AUTH_REDIRECT_URL_PARAMS: [(&str, &str); 3] = [
        ("response_type", "code"),
        ("client_id", CLIENT_ID),
        ("redirect_uri", "itsl-itslearning://login"),
    ];

    #[derive(Deserialize, Debug)]
    pub struct AuthCallbackQuery {
        pub state: String,
        pub code: String,
    }

    #[derive(Deserialize, Debug)]
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
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::<R>::new("itsl-oauth")
        .setup(|app, _api| {
            let config = app.config().plugins.0.get("deep-link");
            let desktop = config.unwrap().get("desktop").unwrap().as_object().unwrap();
            let desktop_schemes = desktop.get("schemes").unwrap().as_array().unwrap();
            println!("schemes: {:?}", desktop_schemes);
            Ok(())
        })
        .on_navigation(|_webview, url| {
            println!("URL: {}", url);

            // Spawn the async task using `tauri::async_runtime::spawn`
            let url_string = String::from(url.as_str());
            tauri::async_runtime::spawn(async move {
                if !url_string.starts_with(itslearning::SCHEME) {
                    return;
                }

                if let Err(e) = handle_itslearning_auth_callback(url_string).await {
                    eprintln!("Error handling auth callback: {}", e);
                }
            });

            url.scheme() != itslearning::SCHEME
        })
        .build()
}

pub async fn get_auth_url() -> Result<String, Box<dyn std::error::Error>> {
    let mut url = reqwest::Url::parse(itslearning::AUTH_REDIRECT_URL)?;
    for (key, value) in itslearning::AUTH_REDIRECT_URL_PARAMS.iter() {
        url.query_pairs_mut().append_pair(key, value);
    }
    Ok(url.to_string())
}

async fn handle_itslearning_auth_callback(
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

        match res.status() {
            reqwest::StatusCode::OK => {
                let auth_response = res.json::<itslearning::AuthCallbackResponse>().await?;
                println!("Auth response: {:?}", auth_response);
                Ok(auth_response)
            }
            _ => Err(Box::new(std::io::Error::new(
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
