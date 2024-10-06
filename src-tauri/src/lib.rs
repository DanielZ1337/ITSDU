mod auth;
mod proxy;
use std::path::PathBuf;

use serde_json::json;
use tauri::{Manager, Wry};
use tauri_plugin_store::{with_store, StoreCollection};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_access_token(app_handle: tauri::AppHandle) -> String {
    let app_handle_path = app_handle.path();
    let tokens = auth::auth::get_tokens(app_handle_path).expect("Failed to get tokens");
    tokens.access_token
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::async_runtime::spawn(async move {
        proxy::start_proxy_server().await;
    });
    let mut builder = tauri::Builder::default();

    #[cfg(desktop)]
    {
        builder = builder.plugin(tauri_plugin_single_instance::init(|_app, argv, _cwd| {
          println!("a new app instance was opened with {argv:?} and the deep link event was already triggered");
          // when defining deep link schemes at runtime, you must also check `argv` here
        }));
    }

    builder
        .plugin(tauri_plugin_deep_link::init())
        .setup(|app| {
            #[cfg(any(target_os = "linux", all(debug_assertions, windows)))]
            {
                use tauri_plugin_deep_link::DeepLinkExt;
                app.deep_link().register_all()?;

                app.deep_link().on_open_url(|event| {
                    println!("deep link URLs: {:?}", event.urls());
                });
            }
            Ok(())
        })
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(auth::auth::init())
        .setup(|app| {
            let stores = app
                .handle()
                .try_state::<StoreCollection<Wry>>()
                .ok_or("Store not found")?;
            let path = PathBuf::from("store.bin");

            with_store(app.handle().clone(), stores, path, |store| {
                // Note that values must be serde_json::Value instances,
                // otherwise, they will not be compatible with the JavaScript bindings.
                store.insert("some-key".to_string(), json!({ "value": 5 }))?;

                // Get a value from the store.
                let value = store
                    .get("some-key")
                    .expect("Failed to get value from store");
                println!("{}", value); // {"value":5}

                // You can manually save the store after making changes.
                // Otherwise, it will save upon graceful exit as described above.
                store.save()?;

                Ok(())
            });

            Ok(())
        })
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, get_access_token])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
