# MediaPress

Nền tảng xử lý video và ảnh trực tuyến — nén, chỉnh sửa, chuyển định dạng ngay trên trình duyệt, không cần cài đặt phần mềm.

---

## Tính năng

- **Nén Video** — Giảm kích thước MP4, AVI, MKV, WebM tới 90% với 3 mức preset (Thấp / Trung bình / Cao)
- **Chỉnh sửa Ảnh** — Resize, nén, chuyển định dạng JPG, PNG, WebP
- **Xác thực** — Đăng ký / Đăng nhập bằng Email hoặc Google OAuth 2.0
- **Realtime progress** — Theo dõi tiến độ xử lý qua HTTP polling
- **Lịch sử tác vụ** — Xem và tải lại file đã xử lý (lưu 7 ngày)
- **Responsive** — Hoạt động tốt trên Desktop, Tablet, Mobile

---

## Tech Stack

| Layer | Công nghệ |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, TailwindCSS v4 |
| Backend | Node.js, Express, TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Queue | Bull + Redis |
| Media | FFmpeg (fluent-ffmpeg) |
| Auth | JWT + Passport.js (Google OAuth 2.0) |
| Realtime | Socket.IO |
| Container | Docker + Docker Compose |

---

## Yêu cầu

- Node.js 20+
- Docker & Docker Compose
- FFmpeg (prebuilt binary)

---

## Cài đặt & Chạy

### 1. Clone repo

```bash
git clone https://github.com/Dat9161/compress_video.git
cd compress_video
```

### 2. Tải FFmpeg

Tải bản prebuilt tại [gyan.dev/ffmpeg/builds](https://www.gyan.dev/ffmpeg/builds/) → `ffmpeg-release-essentials.zip`

Giải nén, ví dụ vào `C:\ffmpeg\`

### 3. Khởi động Database & Redis

```bash
cd mediapress
docker-compose up -d
```

### 4. Cấu hình Backend

```bash
cd mediapress/backend
cp .env.example .env
```

Mở file `.env` và điền các giá trị:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/mediapress"
REDIS_URL="redis://localhost:6379"

JWT_SECRET=your_secret_here
JWT_REFRESH_SECRET=your_refresh_secret_here

FFMPEG_PATH=C:\ffmpeg\bin\ffmpeg.exe
FFPROBE_PATH=C:\ffmpeg\bin\ffprobe.exe

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

FRONTEND_URL=http://localhost:5173
```

### 5. Chạy migration & Backend

```bash
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

### 6. Chạy Workers (terminal riêng)

```bash
# Video worker
npx tsx src/workers/video.worker.ts

# Image worker
npx tsx src/workers/image.worker.ts
```

### 7. Chạy Frontend

```bash
cd mediapress/frontend
npm install
npm run dev
```

Truy cập: **http://localhost:5173**

---

## Cấu trúc dự án

```
compress_video/
├── mediapress/
│   ├── backend/
│   │   ├── prisma/              # Schema & migrations
│   │   ├── src/
│   │   │   ├── controllers/     # Auth, Upload, Job
│   │   │   ├── middleware/      # Auth, Error handler
│   │   │   ├── routes/          # API routes
│   │   │   ├── services/        # Queue, Storage, Passport
│   │   │   ├── utils/           # Logger, Prisma, FFmpeg, Socket
│   │   │   ├── workers/         # Video & Image workers
│   │   │   └── index.ts         # Entry point
│   │   └── .env.example
│   │
│   ├── frontend/
│   │   └── src/
│   │       ├── components/      # Navbar, LogoCube, ProgressBar...
│   │       ├── hooks/           # useSocket
│   │       ├── pages/           # Landing, Login, Register, Dashboard...
│   │       ├── services/        # Axios API client
│   │       ├── stores/          # Zustand auth store
│   │       ├── types/           # TypeScript types
│   │       └── utils/           # Download helper
│   │
│   └── docker-compose.yml
│
├── SRS.md                       # Software Requirements Specification
└── README.md
```

---

## API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | `/api/auth/register` | Đăng ký tài khoản |
| POST | `/api/auth/login` | Đăng nhập |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/me` | Thông tin user hiện tại |
| GET | `/api/auth/google` | Bắt đầu Google OAuth |
| GET | `/api/auth/google/callback` | Callback Google OAuth |
| POST | `/api/upload/video` | Upload video |
| POST | `/api/upload/image` | Upload ảnh |
| POST | `/api/jobs/compress-video` | Tạo job nén video |
| POST | `/api/jobs/edit-image` | Tạo job chỉnh sửa ảnh |
| GET | `/api/jobs` | Lấy danh sách jobs |
| GET | `/api/jobs/:id` | Lấy chi tiết job |
| DELETE | `/api/jobs/:id` | Xóa job |
| GET | `/api/download/:jobId` | Tải file output |
| GET | `/api/health` | Health check |

---

## Cấu hình Google OAuth

1. Vào [console.cloud.google.com](https://console.cloud.google.com)
2. Tạo project → **APIs & Services** → **Credentials** → **OAuth 2.0 Client ID**
3. Application type: **Web application**
4. Authorized JavaScript origins: `http://localhost:5173`
5. Authorized redirect URIs: `http://localhost:3001/api/auth/google/callback`
6. Copy **Client ID** và **Client Secret** vào `.env`

---

## Scripts

### Backend

```bash
npm run dev          # Chạy development server (tsx watch)
npm run build        # Build TypeScript
npm run db:generate  # Generate Prisma client
npm run db:migrate   # Chạy database migrations
npm run db:studio    # Mở Prisma Studio
```

### Frontend

```bash
npm run dev      # Chạy Vite dev server
npm run build    # Build production
npm run preview  # Preview production build
```

---

## Biến môi trường

| Biến | Mô tả | Mặc định |
|------|-------|---------|
| `PORT` | Port backend | `3001` |
| `DATABASE_URL` | PostgreSQL connection string | — |
| `REDIS_URL` | Redis connection string | `redis://localhost:6379` |
| `JWT_SECRET` | Secret key cho access token | — |
| `JWT_REFRESH_SECRET` | Secret key cho refresh token | — |
| `JWT_EXPIRES_IN` | Thời hạn access token | `15m` |
| `JWT_REFRESH_EXPIRES_IN` | Thời hạn refresh token | `7d` |
| `UPLOAD_DIR` | Thư mục lưu file upload | `./uploads` |
| `MAX_VIDEO_SIZE_MB` | Kích thước video tối đa (MB) | `2048` |
| `MAX_IMAGE_SIZE_MB` | Kích thước ảnh tối đa (MB) | `50` |
| `FILE_RETENTION_DAYS` | Số ngày lưu file output | `7` |
| `FFMPEG_PATH` | Đường dẫn tới ffmpeg binary | — |
| `FFPROBE_PATH` | Đường dẫn tới ffprobe binary | — |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | — |
| `FRONTEND_URL` | URL frontend (CORS) | `http://localhost:5173` |

---

## License

MIT © 2026 MediaPress
