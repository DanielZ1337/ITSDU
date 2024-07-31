use serde::Deserialize;

#[derive(Deserialize, Debug)]
struct ItslearningAuthCallbackQuery {
    state: String,
    code: String,
}

#[derive(Deserialize, Debug)]
struct ItslearningAuthCallbackResponse {
    access_token: String,
    token_type: String,
    expires_in: u64,
    refresh_token: String,
}

enum ItslearningAuthGrantType {
    AuthorizationCode,
    RefreshToken,
}

impl ItslearningAuthGrantType {
    fn as_str(&self) -> &'static str {
        match self {
            ItslearningAuthGrantType::AuthorizationCode => "authorization_code",
            ItslearningAuthGrantType::RefreshToken => "refresh_token",
        }
    }
}

const ITSLEARNING_CLIENT_ID: &'static str = "10ae9d30-1853-48ff-81cb-47b58a325685";

const ITSLEARNING_AUTH_TOKEN_URL: &'static str = "https://sdu.itslearning.com/restapi/oauth2/token";

const ITSLEARNING_AUTH_REDIRECT_URL: &'static str =
    "https://sdu.itslearning.com/restapi/oauth2/authorize";

const ITSLEARNING_AUTH_REDIRECT_URL_PARAMS: [(&'static str, &'static str); 3] = [
    ("response_type", "code"),
    ("client_id", ITSLEARNING_CLIENT_ID),
    ("redirect_uri", "itsl-itslearning://login"),
];

pub fn itslearning_deeplink_handler() {
    let scheme = "itsl-itslearning";

    tauri_plugin_deep_link::prepare(&scheme);

    let _ = tauri_plugin_deep_link::register(scheme, |url| {
        tauri::async_runtime::spawn(async {
            match handle_itslearning_auth_callback(url).await {
                Ok(response) => println!("Auth successful: {:?}", response),
                Err(e) => eprintln!("Error during auth callback: {:?}", e),
            }
        });
    });
}

async fn handle_itslearning_auth_callback(
    url: String,
) -> Result<ItslearningAuthCallbackResponse, Box<dyn std::error::Error>> {
    println!("URL: {}", url);

    let url = url::Url::try_from(url.as_str()).unwrap();

    if let Some(query) = url.query() {
        let auth_query: ItslearningAuthCallbackQuery = serde_qs::from_str(query).unwrap();

        let params = [
            (
                "grant_type",
                ItslearningAuthGrantType::AuthorizationCode.as_str(),
            ),
            ("code", &auth_query.code),
            ("client_id", ITSLEARNING_CLIENT_ID),
        ];
        let client = reqwest::Client::new();
        let res = client
            .post(ITSLEARNING_AUTH_TOKEN_URL)
            // We need to set the content type to application/x-www-form-urlencoded
            // because the request body is a form encoded string
            // .header("Content-Type", "application/x-www-form-urlencoded")
            .form(&params)
            .send()
            .await?;

        match res.status() {
            reqwest::StatusCode::OK => {
                let auth_response = res.json::<ItslearningAuthCallbackResponse>().await?;
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
