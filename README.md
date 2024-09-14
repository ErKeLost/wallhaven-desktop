# Wallhaven Desktop (WIP)

Create top desktop wallpaper software based on wallhaven api

## cross-compilation and distribution

[download](https://github.com/ErKeLost/wallhaven-desktop/releases/tag/app-v0.0.1)

已经通过 cloudflare 代理加本地网络请求完全代理 wallhaven 壁纸服务 （目前只有壁纸服务做了本地代理，未来扩展其他接口）, 墙内可以正常访问 wallhaven 所有壁纸

## Api 地址示例，具体所有 api 可查看 https://wallhaven.cc/help/api 替换前缀即可

like e.g https://wallhaven.fun/api/wallhaven/w/yx6e9l

## 常见问题

mac 安装包已损坏 终端输入 `sudo xattr -rd com.apple.quarantine /Applications/wallhaven.app`

## Tel Stack

Farm + React19 + Tauri + Shadcn/UI

<img width="2348" alt="image" src="https://github.com/user-attachments/assets/09cf8a3c-c126-4822-b1f3-2ca930ed96db">

![image](https://github.com/user-attachments/assets/29788093-038c-42a5-b2e9-3369c9ef5d39)

![image](https://github.com/user-attachments/assets/a23e9d38-1f1b-4c54-818c-a1c566e35462)

<img width="2356" alt="image" src="https://github.com/user-attachments/assets/63fb9efb-5f79-41b6-9afc-37d36528da10">

<img width="2355" alt="image" src="https://github.com/user-attachments/assets/ebc9427d-6ba2-4a01-82b7-d5edd1e10c6b">
