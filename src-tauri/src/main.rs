// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
use dirs;
use futures_util::StreamExt;
use image::imageops::FilterType;
use image::{GenericImageView, ImageFormat};
use reqwest;
#[cfg(windows)]
use std::ffi::CString;
use std::fs::File;
use std::io::Write;
use std::path::PathBuf;
use std::process::Command;
use tauri::api::shell::open;
use tauri::CustomMenuItem;
use tauri::{command, Manager};
#[cfg(windows)]
use winapi::um::winuser::SystemParametersInfoA;
#[cfg(windows)]
use winapi::um::winuser::SPI_SETDESKWALLPAPER;

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

#[command]
async fn download_and_set_wallpaper(
    app_handle: tauri::AppHandle,
    url: String,
    file_name: String,
    resolutions: Option<String>,
) -> Result<(), String> {
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

    let total_size = response.content_length().unwrap_or(0);
    let mut downloaded: u64 = 0;
    let mut stream = response.bytes_stream();
    let mut file = File::create(&image_path).map_err(|e| e.to_string())?;

    app_handle.emit_all("download_start", ()).unwrap();

    while let Some(item) = stream.next().await {
        let chunk = item.map_err(|e| e.to_string())?;
        file.write_all(&chunk).map_err(|e| e.to_string())?;
        downloaded += chunk.len() as u64;
        if total_size > 0 {
            let progress = (downloaded as f64 / total_size as f64 * 100.0) as u32;
            println!("下载进度: {}%", progress);
            app_handle.emit_all("download_progress", progress).unwrap();
        }
    }
    // let bytes: [u8] = response.bytes().await.map_err(|e| e.to_string())?;
    // let bytes = response.bytes().await.map_err(|e| e.to_string())?;

    app_handle.emit_all("download_complete", ()).unwrap();
    if let Some(resolution) = resolutions {
        // // 如果提供了分辨率，则调整图片大小
        // let parts: Vec<&str> = resolution.split('x').collect();
        // if parts.len() != 2 {
        //     return Err("Invalid resolution format".to_string());
        // }
        // let width: u32 = parts[0].parse().map_err(|_| "Invalid width")?;
        // let height: u32 = parts[1].parse().map_err(|_| "Invalid height")?;
        // println!("调整图片大小 开始下载带分辨率的");
        // let img = image::load_from_memory(&bytes).map_err(|e| e.to_string())?;
        // println!("{:?}", img);
        // let resized = img.resize_exact(width, height, FilterType::Lanczos3);
        // println!("{:?}", resized);
        // resized
        //     .save_with_format(&image_path, ImageFormat::Jpeg)
        //     .map_err(|e| e.to_string())?;

        // 如果提供了分辨率，则调整图片大小
        let parts: Vec<&str> = resolution.split('x').collect();
        if parts.len() != 2 {
            return Err("Invalid resolution format".to_string());
        }
        let width: u32 = parts[0].parse().map_err(|_| "Invalid width")?;
        let height: u32 = parts[1].parse().map_err(|_| "Invalid height")?;

        println!("调整图片大小开始");
        let img = image::open(&image_path).map_err(|e| e.to_string())?;
        println!("原始图片大小: {:?}", img.dimensions());
        let resized = img.resize_exact(width, height, image::imageops::FilterType::Lanczos3);
        println!("调整后图片大小: {:?}", resized.dimensions());
        resized
            .save_with_format(&image_path, ImageFormat::Jpeg)
            .map_err(|e| e.to_string())?;
    } else {
        println!("直接提供原始图片");
        // 如果没有提供分辨率，直接保存原始图片
        // 直接写入图片不需要做这个操作了
        // let mut file = File::create(&image_path).map_err(|e| e.to_string())?;
        // file.write_all(&bytes).map_err(|e| e.to_string())?;
    }

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
