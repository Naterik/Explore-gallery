# Explore Gallery - Photo Discovery App

Ứng dụng khám phá ảnh được xây dựng với Next.js, React Query và Tailwind CSS.

## Cách Cài Đặt và Chạy Dự Án

### Yêu Cầu

- Node.js 18+
- npm hoặc yarn

### Bước 1: Cài Đặt

```bash
cd explore-gallery
npm install
```

### Bước 2: Chạy Ứng Dụng

```bash
# Development mode
npm run dev

# Production build
npm run build
npm run start
```

Ứng dụng chạy tại: http://localhost:3000

### Bước 3: Kiểm Tra API

```bash
# Lấy danh sách ảnh
GET http://localhost:3000/api/photos?_page=1&sort=newest

# Lấy danh sách album
GET http://localhost:3000/api/albums

# Tạo ảnh mới
POST http://localhost:3000/api/photos
Body: {
  "title": "New Photo",
  "url": "https://...",
  "thumbnailUrl": "https://...",
  "albumId": 1
}
```

## Cách Test Chức Năng

### 1. Test Danh Sách Ảnh

- Vào trang chủ
- Scroll xuống tự động load ảnh (10 ảnh/trang)
- Ảnh hiển thị trong grid

### 2. Test Search & Filter

- Nhập từ khóa để tìm ảnh
- Chọn album để lọc
- Chọn sort: Mới nhất, Cũ nhất, Tên A-Z, Z-A

### 3. Test Xem Chi Tiết

- Click ảnh mở modal chi tiết
- Hiển thị title, date, album, URL

### 4. Test Tạo Ảnh

- Click nút "Thêm Ảnh Mới"
- Điền form: Album, Tiêu đề, File ảnh
- Ảnh mới hiển thị ở đầu danh sách

## Framework UI và Thư Viện Sử Dụng

### Frontend Framework

- Next.js 16.0.0 - Framework React
- React 19.2.0 - UI library
- TypeScript 5 - Type safety

### State Management & Data

- @tanstack/react-query 5.90.5 - Data fetching & caching
- axios 1.12.2 - HTTP client
- react-intersection-observer 9.16.0 - Infinite scroll

### UI & Styling

- Tailwind CSS 4 - Styling framework
- Radix UI - Accessible components
  - dialog - Modal
  - select - Dropdown
  - label - Form label
- lucide-react 0.548.0 - Icons
- sonner 2.0.7 - Toast notifications

### Form & Validation

- react-hook-form 7.65.0 - Form management
- @hookform/resolvers 5.2.2 - Validation
- zod 4.1.12 - Schema validation

## Database

Lưu trữ tại `lib/db.json`:

```json
{
  "photos": [
    {
      "id": 1,
      "albumId": 1,
      "title": "Photo title",
      "url": "https://...",
      "thumbnailUrl": "https://...",
      "createdAt": "2025-10-29T15:42:30"
    }
  ],
  "albums": [
    {
      "id": 1,
      "userId": 1,
      "title": "Album name"
    }
  ]
}
```

## Deployment

Deploy lên Vercel:

```bash
yarn install
vercel
```

## Author

Naterik - Explore Gallery Team

## License

MIT License
