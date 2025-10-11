# Pergimmikan Server

Backend server untuk website Pergimmikan menggunakan Express.js, Node.js, dan MySQL.

## Struktur Folder

```
server/
├── src/
│   ├── controllers/     # Business logic
│   ├── routes/         # API endpoints
│   ├── models/         # Database models
│   ├── middleware/     # Custom middleware
│   ├── config/         # Configuration files
│   ├── utils/          # Utility functions
│   └── app.js          # Express app setup
├── .env                # Environment variables
├── .gitignore         # Git ignore file
└── package.json       # Project dependencies
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Setup environment variables:
```bash
cp .env.example .env
```

3. Setup database:
```bash
npm run db:setup
```

4. Start server:
```bash
npm run dev     # Development
npm start       # Production
```

## API Documentation

### Authentication
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

### Users
- GET /api/users
- GET /api/users/:id
- PUT /api/users/:id
- DELETE /api/users/:id

### Photos
- GET /api/photos
- POST /api/photos
- GET /api/photos/:id
- PUT /api/photos/:id
- DELETE /api/photos/:id

### Activities
- GET /api/activities
- POST /api/activities
- GET /api/activities/:id
- PUT /api/activities/:id
- DELETE /api/activities/:id

## Environment Variables

```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASS=password
DB_NAME=pergimmikan
JWT_SECRET=your_jwt_secret
```

## Scripts

- `npm start`: Start production server
- `npm run dev`: Start development server with nodemon
- `npm test`: Run tests
- `npm run lint`: Run linter
- `npm run db:setup`: Setup database tables
- `npm run db:seed`: Seed database with initial data

## Contributing

1. Create feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open Pull Request
