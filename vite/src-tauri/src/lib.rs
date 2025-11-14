use reqwest::Client;
use serde_json::{json, Value};
use tauri::{command, Builder};
use tauri_plugin_fs;

// -----------------------------
//  Gemini API 呼叫
// -----------------------------
#[command]
async fn call_gemini(prompt: String) -> Result<String, String> {
    let api_key = "AIzaSyDpqum21VXGyp2EXFzVCffcf479XcYmM1o";

    let url = format!(
        "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key={}",
        api_key
    );

    let body = json!({
        "contents": [
            {
                "parts": [{ "text": prompt }]
            }
        ]
    });

    let client = Client::new();

    let res = client
        .post(&url)
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
        // 啟用 fs plugin（你有讀寫檔案需求必須有這行）
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![
            call_gemini
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
