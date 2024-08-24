// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use dirs;
use reqwest;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use tauri::api::shell::open;
use tauri::CustomMenuItem;
use tauri::{command, Manager};
#[cfg(windows)]
use std::ffi::CString;
#[cfg(windows)]
use winapi::um::winuser::SystemParametersInfoA;
#[cfg(windows)]
use winapi::um::winuser::SPI_SETDESKWALLPAPER;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[command]
async fn download_and_set_wallpaper(app_handle: tauri::AppHandle,url: String, file_name: String) -> Result<(), String> {
    let mut image_path = dirs::home_dir().unwrap_or(PathBuf::from("."));
    let file_name_with_extension = format!("{}.jpg", file_name);
    image_path.push(file_name_with_extension);
    println!("{:?}", url);
    let response = reqwest::get(&url)
        .await
        .map_err(|e| format!("Request failed: {}", e))?;
    if !response.status().is_success() {
        return Err(format!("HTTP error: {}", response.status()));
    }
    app_handle.emit_all("download_start", ()).unwrap();
    let bytes = response.bytes().await.map_err(|e| e.to_string())?;
    app_handle.emit_all("download_complete", ()).unwrap();
    println!("{:?}", image_path);
    let mut file = File::create(&image_path).map_err(|e| e.to_string())?;
    file.write_all(&bytes).map_err(|e| e.to_string())?;

    change_wallpaper(image_path.to_str().unwrap().to_string())
}

fn change_wallpaper(image_path: String) -> Result<(), String> {
    print!("{}", image_path);
    #[cfg(target_os = "windows")]
    {
        let c_image_path = CString::new(image_path).map_err(|e| e.to_string())?;
        unsafe {
            if SystemParametersInfoA(SPI_SETDESKWALLPAPER, 0, c_image_path.as_ptr() as *mut _, 0)
                == 0
            {
                return Err("Failed to set wallpaper".into());
            }
        }
    }

    #[cfg(target_os = "macos")]
    {
        let script = format!(
            r#"tell application "System Events"
                set desktopCount to count of desktops
                repeat with desktopNumber from 1 to desktopCount
                    tell desktop desktopNumber
                        set picture to POSIX file "{}"
                    end tell
                end repeat
            end tell"#,
            image_path
        );

        let output = Command::new("osascript")
            .arg("-e")
            .arg(&script)
            .output()
            .map_err(|e| e.to_string())?;

        if !output.status.success() {
            return Err(String::from_utf8_lossy(&output.stderr).to_string());
        }
    }

    Ok(())
}

fn main() {
    let show = CustomMenuItem::new("show".to_string(), "打开面板");
    let next = CustomMenuItem::new("next".to_string(), "下一张");
    let previous = CustomMenuItem::new("previous".to_string(), "上一张");
    let about_app = CustomMenuItem::new("about_app".to_string(), "关于");
    let quit = CustomMenuItem::new("quit".to_string(), "退出");

    // let tray_menu = SystemTrayMenu::new()
    //     .add_item(show)
    //     .add_native_item(SystemTrayMenuItem::Separator)
    //     .add_item(next)
    //     .add_item(previous)
    //     .add_native_item(SystemTrayMenuItem::Separator)
    //     .add_item(about_app)
    //     .add_native_item(SystemTrayMenuItem::Separator)
    //     .add_item(quit);
    // let system_tray = SystemTray::new().with_menu(tray_menu);
    tauri::Builder::default()
        .on_window_event(|event| match event.event() {
            tauri::WindowEvent::CloseRequested { api, .. } => {
                event.window().hide().unwrap();
                api.prevent_close();
            }
            _ => {}
        })
        .invoke_handler(tauri::generate_handler![download_and_set_wallpaper])
        // .system_tray(system_tray)
        // .on_system_tray_event(|app, event| match event {
        //     SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
        //         "show" => {
        //             let window = app.get_window("main").unwrap();
        //             window.show().unwrap();
        //             window.set_focus().unwrap();
        //         }
        //         "next" => {
        //             app.emit_all(
        //                 "change_wallpaper",
        //                 Payload {
        //                     message: "next_wallpaper".into(),
        //                 },
        //             )
        //             .unwrap();
        //         }
        //         "previous" => {
        //             app.emit_all(
        //                 "change_wallpaper",
        //                 Payload {
        //                     message: "previous_wallpaper".into(),
        //                 },
        //             )
        //             .unwrap();
        //         }
        //         "about_app" => {
        //             let _ = open(
        //                 &app.shell_scope(),
        //                 "https://github.com/Xutaotaotao/wukong-wallpaper",
        //                 None,
        //             );
        //         }
        //         "quit" => {
        //             std::process::exit(0);
        //         }
        //         _ => {}
        //     },
        //     SystemTrayEvent::LeftClick { .. } => {
        //         #[cfg(target_os = "windows")]
        //         {
        //             let window = app.get_window("main").unwrap();
        //             window.show().unwrap();
        //             window.set_focus().unwrap();
        //         }
        //     }
        //     _ => {}
        // })
        .setup(|app| {
            let window = app.get_window("main").unwrap();
            app.listen_global("tauri://activate", move |_event| {
                window.show().unwrap();
                window.set_focus().unwrap();
            });
            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error while building tauri application")
        .run(|_app_handle, event| match event {
            tauri::RunEvent::ExitRequested { api, .. } => {
                api.prevent_exit();
            }
            _ => {}
        })
}
