use crate::auth;

pub fn handle_itslearning_auth_redirect() {
    let scheme = "itsl-itslearning";

    tauri_plugin_deep_link::prepare(&scheme);

    let _ = tauri_plugin_deep_link::register(scheme, |url| {
        println!("URL: {}", url);
    });
}
