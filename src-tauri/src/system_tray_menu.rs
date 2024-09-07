use tauri::{
    AppHandle, CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu,
    SystemTrayMenuItem,
};

// 托盘菜单
pub fn menu() -> SystemTray {
    let tray_menu = SystemTrayMenu::new()
        // .add_submenu(SystemTraySubmenu::new( // 子菜单
        //     "File", // 子菜单名称
        //     SystemTrayMenu::new()
        //         .add_item(CustomMenuItem::new("new_file".to_string(), "New File")) // 子菜单项（新增）
        //         .add_item(CustomMenuItem::new("edit_file".to_string(), "Edit File")), // 子菜单项（编辑）
        // ))
        .add_item(CustomMenuItem::new("pre-picture".to_string(), "上一张").disabled())
        .add_item(CustomMenuItem::new("next-picture".to_string(), "下一张").disabled())
        .add_item(CustomMenuItem::new("random-picture".to_string(), "随机").disabled())
        .add_native_item(SystemTrayMenuItem::Separator)
        .add_item(CustomMenuItem::new("quit".to_string(), "退出"));

    // 设置在右键单击系统托盘时显示菜单
    SystemTray::new().with_menu(tray_menu)
}

// 菜单事件
pub fn handle_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    // 获取应用窗口
    // let window = tauri::Manager::get_window(app, "main").unwrap();
    // 匹配点击事件
    match event {
        // 左键点击
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            if let Some(window) = app.get_window("main") {
                window.unminimize().unwrap(); // 恢复窗口，如果它被最小化
                window.show().unwrap();
                window.set_focus().unwrap();
            }
        }
        // 右键点击
        SystemTrayEvent::RightClick {
            position: _,
            size: _,
            ..
        } => {
            println!("system tray received a right click");
        }
        // 根据菜单 id 进行事件匹配
        SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
            "quit" => {
                std::process::exit(0);
            }
            _ => {}
        },
        _ => {}
    }
}
