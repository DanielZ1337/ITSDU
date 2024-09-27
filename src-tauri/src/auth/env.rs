#[derive(Debug)]
pub struct Env {
    vite_itslearning_store_key: String,
    vite_itslearning_oauth_state: String,
}

pub fn get_auth_env() -> Env {
    dotenv::dotenv().ok();
    let vite_itslearning_store_key = std::env::var("VITE_ITSLEARNING_STORE_KEY")
        .expect("VITE_ITSLEARNING_STORE_KEY must be set.");
    let vite_itslearning_oauth_state = std::env::var("VITE_ITSLEARNING_OAUTH_STATE")
        .expect("VITE_ITSLEARNING_OAUTH_STATE must be set.");

    let env = Env {
        vite_itslearning_store_key,
        vite_itslearning_oauth_state,
    };

    return env;
}