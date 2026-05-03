# Vue 3 Loader

> 🌐 Language / Ngôn ngữ: [English](README.md) | **Tiếng Việt**

Một demo/bộ khởi tạo Vue 3 chạy trực tiếp trên trình duyệt, dùng `vue3-sfc-loader` để tải Single File Component, Pinia để quản lý trạng thái và Vue I18n để đổi ngôn ngữ động. Dự án tập trung vào trải nghiệm loading có tiến trình theo từng giai đoạn trước khi mount ứng dụng chính.

![Default loading screen](screenshots/default-theme-loading-1.png)

## Tính năng chính

- Chạy Vue 3 qua CDN, không cần bước build.
- Tải component `.vue` động bằng `vue3-sfc-loader`.
- Loader toàn màn hình với giao diện chủ đề ốc đảo/sa mạc, progress bar và trạng thái từng bước.
- Tải tuần tự assets, thư viện, component, store và ứng dụng chính.
- Tích hợp Pinia cho state management.
- Tích hợp Vue I18n với lazy-load file ngôn ngữ.
- Hỗ trợ các ngôn ngữ: English, Tiếng Việt, 한국어, 日本語, Deutsch.
- Có xử lý lỗi khi tải asset, script, component hoặc khởi tạo app thất bại.

## Công nghệ sử dụng

- Vue 3
- Vue 3 SFC Loader
- Vue I18n 11
- Pinia 3
- Vue Demi
- HTML, CSS và JavaScript module

## Cấu trúc thư mục

```text
Vue-3-Loader/
├── index.html
├── assets/
│   ├── css/
│   │   ├── loader.css
│   │   └── styles.css
│   ├── img/
│   │   └── loader.gif
│   └── js/
│       ├── helper.js
│       ├── i18n.js
│       ├── init.js
│       ├── locales/
│       │   ├── de.js
│       │   ├── en.js
│       │   ├── ja.js
│       │   ├── ko.js
│       │   └── vi.js
│       └── stores/
│           └── main.js
├── vue/
│   ├── App.vue
│   ├── Loader.js
│   └── Loader.vue
└── screenshots/
```

## Cách chạy dự án

Dự án dùng `fetch`, dynamic import và đường dẫn tuyệt đối như `/assets/...`, vì vậy nên chạy qua HTTP server thay vì mở trực tiếp file `index.html`.

Vào thư mục dự án:

```bash
cd /workspaces/Vue-3-Loader
```

Chạy một static server bất kỳ, ví dụ với Python:

```bash
python3 -m http.server 8000
```

Sau đó mở:

```text
http://localhost:8000
```

## Luồng hoạt động

1. `index.html` tải Vue 3, `vue3-sfc-loader`, Vue I18n và CSS ban đầu của loader.
2. `assets/js/init.js` tạo cấu hình cho `vue3-sfc-loader`.
3. Ứng dụng phát hiện ngôn ngữ từ `localStorage` hoặc trình duyệt.
4. `Loader.vue` được mount vào `#loader`.
5. `Loader.js` chạy các stage tải:
   - assets: tải `assets/css/styles.css`
   - libraries: tải Vue Demi và Pinia
   - components: kiểm tra `/vue/App.vue`
   - store: import `/assets/js/stores/main.js`
   - app: gọi `window.initMainApp()`
   - finalizing: hoàn tất và chuyển sang app chính
6. `initMainApp()` tải `App.vue`, tạo Vue app, gắn Pinia và i18n, rồi mount vào `#app`.
7. Khi hoàn tất, loader fade out, `#app` được hiển thị.

## Thành phần chính

### `vue/Loader.vue`

Định nghĩa giao diện loader toàn màn hình, gồm progress bar, danh sách stage, thông báo hiện tại và hình ảnh minh họa.

### `vue/Loader.js`

Chứa logic tải tuần tự, cập nhật tiến trình, đổi màu progress bar theo stage và xử lý lỗi. File này cũng chịu trách nhiệm gọi `finishLoadApp()` khi ứng dụng đã sẵn sàng.

### `assets/js/init.js`

Thiết lập `vue3-sfc-loader`, chia sẻ module cache cho Vue, Vue I18n và module i18n nội bộ. File này expose `window.initMainApp` để loader gọi khi đến stage khởi động app.

### `vue/App.vue`

Ứng dụng chính sau khi loader hoàn tất. Component này hiển thị tiêu đề, mô tả, bộ chọn ngôn ngữ và trạng thái Pinia store.

### `assets/js/i18n.js`

Tạo i18n instance dùng chung, lazy-load file locale theo ngôn ngữ và lưu ngôn ngữ người dùng vào `localStorage`.

### `assets/js/stores/main.js`

Định nghĩa Pinia store `main` với `message`, `count`, `loadedAt` và các action `increment`, `setLoadedAt`.

## Thêm ngôn ngữ mới

1. Tạo file locale mới trong `assets/js/locales`, ví dụ:

```text
assets/js/locales/fr.js
```

2. Export object cùng cấu trúc với các file locale hiện có:

```js
export default {
  message: {
    title: 'Vue 3 Loader',
    app: {
      subtitle: '...',
      description: '...',
      language: 'Language',
    },
    store: {
      store_state: 'Store State',
      count: 'Count',
      loaded_at: 'Loaded At',
      increment: 'Increment',
      pinia_message: 'Hello from Pinia Store!'
    },
    loader: {
      assets: 'Assets',
      libraries: 'Libraries',
      components: 'Components',
      store: 'Store',
      app: 'App',
      finalizing: 'Finalizing',
      initializing: 'Initializing...',
      loading: 'Loading {item}...',
      starting_app: 'Starting Main App...',
      error_flag: 'Error',
      error_loading: 'Error loading [{stage}]: {message}',
      oasis_route: 'Oasis Route',
      oasis_tagline: 'Across the hot sands, find the oasis',
    },
    errors: {
      failed_to_load: 'Failed to load {item}: {message}',
      network_error: 'Network Error',
      not_found: 'Not Found',
      something_went_wrong: 'Something went wrong',
      init_failed: 'initMainApp reported failure',
      init_undefined: 'initMainApp is not defined',
      unknown_error: 'Unknown error',
      network_error_checking: 'Network error checking {item}: {message}',
      script_execution_failed: 'Script execution failed: {message}',
      failed_to_load_script: 'Failed to load script tag: {item}'
    },
  }
};
```

3. Thêm ngôn ngữ vào `SUPPORTED_LANGUAGES` trong `assets/js/i18n.js`:

```js
{ code: 'fr', label: 'Français' }
```

## Tùy biến loader

- Giao diện loader nằm trong `vue/Loader.vue`.
- Style của loader nằm trong `assets/css/loader.css`.
- Danh sách stage tải nằm trong computed `stages` của `vue/Loader.js`.
- Màu progress bar được điều khiển bởi `progressClass` trong `vue/Loader.js` và các class CSS tương ứng trong `loader.css`.

Khi thêm stage mới, hãy thêm object mới vào `stages`:

```js
{
  id: 'custom',
  label: t('message.loader.custom') || 'Custom',
  action: async () => {
    // logic tải hoặc kiểm tra tài nguyên
  }
}
```

Sau đó bổ sung key dịch tương ứng trong các file locale.

## Lưu ý khi phát triển

- Các dependency chính đang được tải từ CDN, nên cần kết nối mạng khi chạy lần đầu.
- Do dùng đường dẫn tuyệt đối `/assets/...` và `/vue/...`, hãy chạy server tại root của dự án.
- `vue3-sfc-loader` phù hợp cho demo/prototype hoặc môi trường không build. Với production lớn, nên cân nhắc Vite hoặc Vue CLI để bundling, tối ưu cache và kiểm soát dependency tốt hơn.
- Một số delay trong loader là delay mô phỏng để người dùng thấy rõ từng stage tải.

## Ảnh chụp

Thư mục `screenshots/` chứa nhiều trạng thái loading và theme mẫu, ví dụ:

- `screenshots/default-theme-loading-1.png`
- `screenshots/default-theme-loading-2.png`
- `screenshots/default-theme-loaded.png`
- `screenshots/theme-1-loading-1.png`
- `screenshots/theme-11-loading-2.png`

## Giấy phép

Dự án này được cấp phép theo [MIT License](./LICENSE).
