use reqwest::Client;
use serde_json::{json, Value};
use tauri::{command, Builder};
use tauri_plugin_fs;

// -----------------------------
//  ChatGPT API 呼叫 (free.v36.cm)
// -----------------------------
#[command]
async fn call_chatgpt(prompt: String) -> Result<String, String> {
    let api_key = "sk-U7R7DD8l4EYNY2E6D3A8A4B81a1842D89830Fb06D8F08fDf";  // ← 這邊改成你申請到的 key

    let url = "https://free.v36.cm/v1/chat/completions";

    let body = json!({
        "model": "gpt-4o-mini",
        "messages": [
            { "role": "user", "content": prompt }
        ]
    });

    let client = Client::new();

    let res = client
        .post(url)
        .header("Authorization", format!("Bearer {}", api_key))
        .json(&body)
        .send()
        .await
        .map_err(|e| format!("Request error: {}", e))?;

    let json_resp: Value = res
        .json()
        .await
        .map_err(|e| format!("Parse JSON error: {}", e))?;

    Ok(json_resp.to_string())
}

// -----------------------------
//  app run (main)
// -----------------------------
pub fn run() {
    Builder::default()
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            call_chatgpt
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
