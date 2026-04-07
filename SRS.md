# Software Requirements Specification (SRS)
# Hệ thống Nén và Chỉnh sửa Video/Ảnh Trực tuyến

**Phiên bản:** 1.0  
**Ngày:** 07/04/2026  
**Tác giả:** [Tên sinh viên]  
**Trường:** [Tên trường đại học]

---

## 1. GIỚI THIỆU

### 1.1 Mục đích
Tài liệu này mô tả đầy đủ các yêu cầu phần mềm cho hệ thống web cho phép người dùng nén video, giảm kích thước file, và chỉnh sửa video/ảnh trực tuyến mà không cần cài đặt phần mềm.

### 1.2 Phạm vi dự án
Hệ thống có tên **MediaPress** — một nền tảng web xử lý media trực tuyến bao gồm:
- Nén video (giảm kích thước, thay đổi bitrate, độ phân giải)
- Chỉnh sửa video (cắt, ghép, thêm watermark, thay đổi tốc độ)
- Chỉnh sửa ảnh (resize, crop, nén, chuyển đổi định dạng, bộ lọc)
- Quản lý file đã xử lý và lịch sử thao tác

### 1.3 Định nghĩa và từ viết tắt
| Thuật ngữ | Giải thích |
|-----------|-----------|
| SRS | Software Requirements Specification |
| FFmpeg | Thư viện xử lý video/audio mã nguồn mở |
| Bitrate | Tốc độ bit của video, ảnh hưởng đến chất lượng và kích thước |
| Codec | Bộ mã hóa/giải mã video (H.264, H.265, VP9...) |
| API | Application Programming Interface |
| JWT | JSON Web Token — cơ chế xác thực |
| CDN | Content Delivery Network |
| Queue | Hàng đợi xử lý tác vụ nặng |

### 1.4 Tài liệu tham khảo
- FFmpeg Documentation: https://ffmpeg.org/documentation.html
- React Documentation: https://react.dev
- Node.js Documentation: https://nodejs.org/docs

---

## 2. MÔ TẢ TỔNG QUAN HỆ THỐNG

### 2.1 Bối cảnh sản phẩm
MediaPress là ứng dụng web SPA (Single Page Application) hoạt động theo mô hình Client-Server. Người dùng upload file lên server, server xử lý bằng FFmpeg và trả về file đã xử lý để tải xuống.

### 2.2 Chức năng chính
- Đăng ký / Đăng nhập tài khoản
- Upload video và ảnh
- Nén video với nhiều tùy chọn
- Chỉnh sửa video (cắt, ghép, watermark, tốc độ)
- Chỉnh sửa ảnh (resize, crop, filter, chuyển định dạng)
- Xem lịch sử xử lý và tải lại file
- Quản lý dung lượng lưu trữ cá nhân

### 2.3 Người dùng mục tiêu
| Nhóm | Mô tả |
|------|-------|
| Người dùng thông thường | Muốn nén video để chia sẻ lên mạng xã hội |
| Content Creator | Cần chỉnh sửa nhanh video/ảnh |
| Sinh viên / Học sinh | Cần giảm kích thước file để nộp bài |
| Người dùng không chuyên | Không muốn cài phần mềm nặng |

### 2.4 Ràng buộc chung
- Hỗ trợ trình duyệt: Chrome, Firefox, Edge (phiên bản mới nhất)
- Kích thước file upload tối đa: 2GB (video), 50MB (ảnh)
- Thời gian xử lý tối đa: 30 phút/tác vụ
- File lưu trữ tối đa 7 ngày sau khi xử lý xong

---

## 3. CÔNG NGHỆ SỬ DỤNG

### 3.1 Frontend
| Công nghệ | Phiên bản | Lý do chọn |
|-----------|-----------|-----------|
| React | 18.x | Phổ biến, hệ sinh thái lớn, phù hợp SPA |
| TypeScript | 5.x | Type safety, dễ bảo trì, phát hiện lỗi sớm |
| TailwindCSS | 3.x | Styling nhanh, responsive dễ dàng |
| Vite | 5.x | Build tool nhanh hơn CRA |
| React Query | 5.x | Quản lý server state, caching API |
| Zustand | 4.x | State management nhẹ, đơn giản |
| React Dropzone | - | Kéo thả file upload |
| FFmpeg.wasm | - | Xử lý ảnh nhẹ phía client (tùy chọn) |
| Axios | - | HTTP client |

### 3.2 Backend
| Công nghệ | Phiên bản | Lý do chọn |
|-----------|-----------|-----------|
| Node.js | 20.x LTS | JavaScript full-stack, async I/O tốt |
| Express.js | 4.x | Framework nhẹ, linh hoạt |
| TypeScript | 5.x | Đồng nhất với frontend |
| Fluent-FFmpeg | - | Wrapper FFmpeg cho Node.js |
| FFmpeg | 6.x | Xử lý video/audio mạnh mẽ, miễn phí |
| Multer | - | Xử lý file upload multipart |
| Bull | 4.x | Job queue xử lý tác vụ nặng |
| JWT (jsonwebtoken) | - | Xác thực người dùng |
| Bcrypt | - | Mã hóa mật khẩu |
| Joi / Zod | - | Validation dữ liệu đầu vào |

### 3.3 Database & Storage
| Công nghệ | Lý do chọn |
|-----------|-----------|
| PostgreSQL 16 | Relational DB ổn định, hỗ trợ JSON |
| Prisma ORM | Type-safe, migration dễ dàng |
| Redis 7 | Cache + Bull queue backend |
| Local Storage / AWS S3 | Lưu file upload và output |

### 3.4 DevOps & Công cụ hỗ trợ
| Công nghệ | Mục đích |
|-----------|---------|
| Docker + Docker Compose | Containerize toàn bộ hệ thống |
| Nginx | Reverse proxy, serve static files |
| GitHub Actions | CI/CD pipeline |
| ESLint + Prettier | Code quality |

---

## 4. YÊU CẦU CHỨC NĂNG (Functional Requirements)

### 4.1 Module Xác thực (Authentication)

**FR-AUTH-01: Đăng ký tài khoản**
- Người dùng nhập email, mật khẩu, tên hiển thị
- Hệ thống kiểm tra email chưa tồn tại
- Mật khẩu tối thiểu 8 ký tự, có chữ hoa và số
- Gửi email xác nhận sau khi đăng ký

**FR-AUTH-02: Đăng nhập**
- Đăng nhập bằng email + mật khẩu
- Hỗ trợ đăng nhập bằng Google OAuth 2.0
- Trả về JWT access token (15 phút) và refresh token (7 ngày)
- Khóa tài khoản sau 5 lần đăng nhập sai liên tiếp

**FR-AUTH-03: Quản lý phiên**
- Tự động refresh token khi hết hạn
- Đăng xuất xóa token phía client và server
- Hỗ trợ đăng xuất tất cả thiết bị

### 4.2 Module Upload File

**FR-UPLOAD-01: Upload Video**
- Hỗ trợ định dạng: MP4, AVI, MOV, MKV, WebM, FLV
- Kích thước tối đa: 2GB
- Hiển thị progress bar realtime
- Hỗ trợ kéo thả (drag & drop)
- Validate định dạng và kích thước trước khi upload

**FR-UPLOAD-02: Upload Ảnh**
- Hỗ trợ định dạng: JPG, PNG, WebP, GIF, BMP, TIFF
- Kích thước tối đa: 50MB
- Upload nhiều ảnh cùng lúc (tối đa 20 ảnh)

**FR-UPLOAD-03: Xem trước file**
- Preview video trước khi xử lý
- Preview ảnh với zoom in/out
- Hiển thị thông tin file: kích thước, độ phân giải, thời lượng, codec

### 4.3 Module Nén Video

**FR-VIDEO-COMPRESS-01: Nén cơ bản**
- Chọn mức nén: Thấp / Trung bình / Cao / Tùy chỉnh
- Hiển thị ước tính kích thước sau nén
- Giữ nguyên tỷ lệ khung hình

**FR-VIDEO-COMPRESS-02: Tùy chỉnh nâng cao**
- Thay đổi codec: H.264, H.265 (HEVC), VP9
- Điều chỉnh bitrate video (kbps)
- Điều chỉnh bitrate audio
- Thay đổi độ phân giải: 4K, 1080p, 720p, 480p, 360p, tùy chỉnh
- Thay đổi FPS: 60, 30, 24, 15
- Chọn định dạng output: MP4, WebM, MKV

**FR-VIDEO-COMPRESS-03: Xử lý hàng loạt**
- Nén nhiều video cùng lúc (tối đa 5 video)
- Áp dụng cùng cài đặt cho tất cả

### 4.4 Module Chỉnh sửa Video

**FR-VIDEO-EDIT-01: Cắt video (Trim)**
- Chọn điểm bắt đầu và kết thúc bằng thanh timeline
- Nhập thời gian chính xác (HH:MM:SS)
- Preview đoạn đã cắt trước khi xuất

**FR-VIDEO-EDIT-02: Ghép video (Merge)**
- Ghép nhiều video thành một (tối đa 10 video)
- Kéo thả để sắp xếp thứ tự
- Tự động chuẩn hóa độ phân giải và FPS

**FR-VIDEO-EDIT-03: Thêm Watermark**
- Upload ảnh watermark (PNG có nền trong suốt)
- Chọn vị trí: 4 góc, giữa
- Điều chỉnh kích thước và độ trong suốt (opacity)

**FR-VIDEO-EDIT-04: Thay đổi tốc độ**
- Tăng tốc: 1.25x, 1.5x, 2x
- Giảm tốc: 0.75x, 0.5x, 0.25x
- Tùy chỉnh từ 0.1x đến 4x

**FR-VIDEO-EDIT-05: Xoay và lật video**
- Xoay 90°, 180°, 270°
- Lật ngang / dọc

**FR-VIDEO-EDIT-06: Tắt tiếng / Thay âm thanh**
- Tắt hoàn toàn âm thanh
- Thay thế bằng file audio khác (MP3, AAC)

### 4.5 Module Chỉnh sửa Ảnh

**FR-IMAGE-EDIT-01: Resize ảnh**
- Nhập chiều rộng/cao tùy chỉnh
- Giữ tỷ lệ khung hình tự động
- Preset: 1920x1080, 1280x720, 800x600, thumbnail...

**FR-IMAGE-EDIT-02: Crop ảnh**
- Crop tự do bằng cách kéo vùng chọn
- Crop theo tỷ lệ cố định: 1:1, 4:3, 16:9, 3:2

**FR-IMAGE-EDIT-03: Nén ảnh**
- Điều chỉnh chất lượng (quality 1-100)
- Hiển thị so sánh kích thước trước/sau
- Chuyển đổi định dạng: JPG, PNG, WebP, AVIF

**FR-IMAGE-EDIT-04: Bộ lọc và điều chỉnh màu**
- Điều chỉnh: Độ sáng, Tương phản, Bão hòa, Sắc nét
- Bộ lọc preset: Grayscale, Sepia, Vintage, Vivid

**FR-IMAGE-EDIT-05: Xử lý hàng loạt ảnh**
- Áp dụng cùng thao tác cho nhiều ảnh
- Tải xuống dưới dạng file ZIP

### 4.6 Module Quản lý File & Lịch sử

**FR-HISTORY-01: Lịch sử xử lý**
- Xem danh sách tất cả tác vụ đã thực hiện
- Trạng thái: Đang xử lý / Hoàn thành / Lỗi
- Tải lại file output đã xử lý (trong 7 ngày)

**FR-HISTORY-02: Quản lý lưu trữ**
- Xem dung lượng đã sử dụng
- Xóa file thủ công
- Tự động xóa file sau 7 ngày

---

## 5. YÊU CẦU PHI CHỨC NĂNG (Non-Functional Requirements)

### 5.1 Hiệu năng (Performance)
- Thời gian tải trang lần đầu < 3 giây
- Upload 100MB video trong < 60 giây (mạng 10Mbps)
- Nén video 100MB (720p) trong < 5 phút
- Hệ thống xử lý đồng thời tối thiểu 50 tác vụ

### 5.2 Bảo mật (Security)
- Tất cả API endpoint yêu cầu xác thực JWT (trừ auth)
- HTTPS bắt buộc cho toàn bộ hệ thống
- Validate và sanitize tất cả input từ người dùng
- Rate limiting: 100 request/phút/IP
- File upload: kiểm tra MIME type thực sự (không chỉ extension)
- Không lưu mật khẩu dạng plaintext (bcrypt salt rounds = 12)
- CORS chỉ cho phép domain được cấu hình

### 5.3 Khả dụng (Availability)
- Uptime mục tiêu: 99.5%
- Graceful degradation khi queue đầy
- Thông báo rõ ràng khi hệ thống bảo trì

### 5.4 Khả năng mở rộng (Scalability)
- Kiến trúc hỗ trợ horizontal scaling
- Queue-based processing tách biệt với API server
- Stateless API server (JWT, không session server-side)

### 5.5 Khả năng sử dụng (Usability)
- Giao diện responsive: Desktop, Tablet, Mobile
- Hỗ trợ tiếng Việt và tiếng Anh
- Thông báo lỗi rõ ràng, dễ hiểu
- Hướng dẫn sử dụng inline (tooltip, placeholder)

### 5.6 Khả năng bảo trì (Maintainability)
- Code coverage test tối thiểu 70%
- Tài liệu API theo chuẩn OpenAPI 3.0
- Logging đầy đủ với Winston
- Cấu hình qua biến môi trường (.env)

---

## 6. KIẾN TRÚC HỆ THỐNG

### 6.1 Tổng quan kiến trúc
```
[Client Browser]
      |
      | HTTPS
      v
[Nginx Reverse Proxy]
      |
   +--+--+
   |     |
   v     v
[React  [Express API Server]
 SPA]        |
         +---+---+
         |       |
         v       v
    [PostgreSQL] [Redis + Bull Queue]
                      |
                      v
               [FFmpeg Worker Process]
                      |
                      v
               [File Storage (Local/S3)]
```

### 6.2 Luồng xử lý video
1. Client upload file → Nginx → API Server
2. API Server lưu file tạm, tạo Job record trong DB
3. API Server đẩy job vào Bull Queue (Redis)
4. Worker lấy job từ queue, chạy FFmpeg
5. Worker cập nhật tiến độ realtime qua WebSocket
6. Worker lưu file output, cập nhật DB
7. Client nhận thông báo hoàn thành, tải file

### 6.3 Cấu trúc thư mục dự án
```
mediapress/
├── frontend/                  # React App
│   ├── src/
│   │   ├── components/        # UI components
│   │   ├── pages/             # Route pages
│   │   ├── hooks/             # Custom hooks
│   │   ├── stores/            # Zustand stores
│   │   ├── services/          # API calls
│   │   └── types/             # TypeScript types
│   └── package.json
│
├── backend/                   # Node.js API
│   ├── src/
│   │   ├── routes/            # Express routes
│   │   ├── controllers/       # Business logic
│   │   ├── services/          # FFmpeg, storage...
│   │   ├── workers/           # Bull job workers
│   │   ├── middleware/        # Auth, validation...
│   │   ├── prisma/            # DB schema & migrations
│   │   └── utils/             # Helpers
│   └── package.json
│
├── docker-compose.yml
└── nginx.conf
```

---

## 7. THIẾT KẾ DATABASE

### 7.1 Bảng Users
```sql
users (
  id          UUID PRIMARY KEY,
  email       VARCHAR(255) UNIQUE NOT NULL,
  password    VARCHAR(255),           -- null nếu dùng OAuth
  name        VARCHAR(100) NOT NULL,
  avatar_url  VARCHAR(500),
  provider    ENUM('local', 'google') DEFAULT 'local',
  is_verified BOOLEAN DEFAULT false,
  storage_used BIGINT DEFAULT 0,      -- bytes
  created_at  TIMESTAMP DEFAULT NOW(),
  updated_at  TIMESTAMP DEFAULT NOW()
)
```

### 7.2 Bảng Jobs (Tác vụ xử lý)
```sql
jobs (
  id            UUID PRIMARY KEY,
  user_id       UUID REFERENCES users(id),
  type          ENUM('video_compress', 'video_edit', 'image_edit'),
  status        ENUM('pending', 'processing', 'completed', 'failed'),
  progress      INTEGER DEFAULT 0,    -- 0-100%
  input_file    JSONB NOT NULL,       -- {name, size, path, format}
  output_file   JSONB,                -- {name, size, path, format}
  settings      JSONB NOT NULL,       -- cài đặt xử lý
  error_message TEXT,
  started_at    TIMESTAMP,
  completed_at  TIMESTAMP,
  expires_at    TIMESTAMP,            -- thời điểm xóa file
  created_at    TIMESTAMP DEFAULT NOW()
)
```

### 7.3 Bảng Files
```sql
files (
  id          UUID PRIMARY KEY,
  job_id      UUID REFERENCES jobs(id),
  user_id     UUID REFERENCES users(id),
  type        ENUM('input', 'output'),
  filename    VARCHAR(255) NOT NULL,
  storage_key VARCHAR(500) NOT NULL,  -- đường dẫn trong storage
  size        BIGINT NOT NULL,        -- bytes
  mime_type   VARCHAR(100),
  metadata    JSONB,                  -- width, height, duration...
  created_at  TIMESTAMP DEFAULT NOW()
)
```

---

## 8. THIẾT KẾ API (REST)

### 8.1 Authentication Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký tài khoản |
| POST | /api/auth/login | Đăng nhập |
| POST | /api/auth/logout | Đăng xuất |
| POST | /api/auth/refresh | Refresh access token |
| GET | /api/auth/google | OAuth Google |
| POST | /api/auth/verify-email | Xác nhận email |

### 8.2 Upload Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/upload/video | Upload video |
| POST | /api/upload/image | Upload ảnh |
| GET | /api/upload/:id/info | Lấy thông tin file đã upload |

### 8.3 Processing Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/jobs/compress-video | Tạo job nén video |
| POST | /api/jobs/edit-video | Tạo job chỉnh sửa video |
| POST | /api/jobs/edit-image | Tạo job chỉnh sửa ảnh |
| GET | /api/jobs | Lấy danh sách jobs |
| GET | /api/jobs/:id | Lấy chi tiết job |
| DELETE | /api/jobs/:id | Xóa job và file |

### 8.4 Download Endpoints
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | /api/download/:jobId | Tải file output |
| GET | /api/download/:jobId/zip | Tải nhiều file dạng ZIP |

### 8.5 WebSocket Events
| Event | Hướng | Mô tả |
|-------|-------|-------|
| job:progress | Server → Client | Cập nhật tiến độ (0-100%) |
| job:completed | Server → Client | Thông báo hoàn thành |
| job:failed | Server → Client | Thông báo lỗi |

---

## 9. KẾ HOẠCH TRIỂN KHAI

### 9.1 Giai đoạn phát triển (Roadmap)

**Phase 1 — MVP (4 tuần)**
- [ ] Setup project, Docker, CI/CD
- [ ] Authentication (đăng ký, đăng nhập, JWT)
- [ ] Upload video/ảnh
- [ ] Nén video cơ bản (3 mức: thấp/trung/cao)
- [ ] Nén ảnh và chuyển định dạng
- [ ] Tải file output

**Phase 2 — Core Features (4 tuần)**
- [ ] Chỉnh sửa video: cắt, xoay, tắt tiếng
- [ ] Chỉnh sửa ảnh: resize, crop, bộ lọc
- [ ] Realtime progress qua WebSocket
- [ ] Lịch sử tác vụ
- [ ] Tùy chỉnh nén nâng cao

**Phase 3 — Advanced (3 tuần)**
- [ ] Ghép video, thêm watermark
- [ ] Xử lý hàng loạt
- [ ] Google OAuth
- [ ] Tối ưu hiệu năng, caching

### 9.2 Môi trường triển khai
| Môi trường | Mô tả |
|-----------|-------|
| Development | Local Docker Compose |
| Staging | VPS nhỏ (2 CPU, 4GB RAM) |
| Production | VPS (4 CPU, 8GB RAM) hoặc cloud |

### 9.3 Yêu cầu phần cứng tối thiểu (Server)
- CPU: 4 cores (FFmpeg cần nhiều CPU)
- RAM: 8GB
- Storage: 100GB SSD
- Bandwidth: 100Mbps

---

## 10. RỦI RO VÀ GIẢI PHÁP

| Rủi ro | Mức độ | Giải pháp |
|--------|--------|-----------|
| File upload lớn gây timeout | Cao | Chunked upload, tăng timeout Nginx |
| FFmpeg xử lý chậm | Cao | Job queue, giới hạn concurrent jobs |
| Hết dung lượng server | Trung bình | Tự động xóa file cũ, giới hạn storage/user |
| Người dùng upload file độc hại | Cao | Kiểm tra MIME type, sandbox FFmpeg |
| Server quá tải | Trung bình | Rate limiting, queue với priority |
| Mất file khi server crash | Trung bình | Backup định kỳ, dùng S3 cho production |

---

## 11. TIÊU CHÍ CHẤP NHẬN (Acceptance Criteria)

Dự án được coi là hoàn thành khi:
1. Người dùng có thể đăng ký, đăng nhập thành công
2. Upload và nén video MP4 720p giảm ít nhất 40% kích thước
3. Cắt video theo thời gian chính xác ±1 giây
4. Resize và nén ảnh JPG/PNG thành công
5. Hiển thị tiến độ xử lý realtime
6. Tải xuống file đã xử lý thành công
7. Giao diện hoạt động tốt trên mobile
8. Thời gian xử lý video 100MB < 10 phút

---

*Tài liệu này sẽ được cập nhật theo tiến độ phát triển dự án.*
