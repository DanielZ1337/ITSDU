// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Listener;
use tauri_plugin_deep_link::{listen, prepare, register, set_identifier, unregister};
mod auth;

mod proxy;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    auth::auth::itslearning_deeplink_handler();

    let proxy_handle = tokio::spawn(async {
        if let Err(e) = proxy::start_proxy_server().await {
            eprintln!("Proxy server error: {}", e);
        }
    });

    tauri::Builder::default()
        .plugin(tauri_plugin_stronghold::Builder::new(|pass| todo!()).build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    // Ensure the proxy server future is awaited
    proxy_handle.await?;

    Ok(())
}
