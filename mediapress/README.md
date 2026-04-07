# MediaPress — MVP Setup Guide

## Yêu cầu
- Node.js 20+
- Docker & Docker Compose
- FFmpeg (cài trên máy host)

## Cài FFmpeg

**Windows:** Tải tại https://ffmpeg.org/download.html, giải nén và thêm vào PATH  
**macOS:** `brew install ffmpeg`  
**Ubuntu:** `sudo apt install ffmpeg`

## Chạy dự án

### 1. Khởi động database và Redis
```bash
cd mediapress
docker-compose up -d
```

### 2. Setup Backend
```bash
cd backend
cp .env.example .env
npm install
npm run db:generate
npm run db:migrate
npm run dev
```

### 3. Chạy Worker (terminal riêng)
```bash
cd backend
npx tsx src/workers/video.worker.ts
```

### 4. Setup Frontend
```bash
cd frontend
npm run dev
```

Truy cập: http://localhost:5173

## Cấu trúc API

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| POST | /api/auth/register | Đăng ký |
| POST | /api/auth/login | Đăng nhập |
| GET | /api/auth/me | Thông tin user |
| POST | /api/upload/video | Upload video |
| POST | /api/upload/image | Upload ảnh |
| POST | /api/jobs/compress-video | Tạo job nén video |
| POST | /api/jobs/edit-image | Tạo job chỉnh sửa ảnh |
| GET | /api/jobs | Lịch sử jobs |
| GET | /api/download/:jobId | Tải file output |
