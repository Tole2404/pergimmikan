# Contributing to PERGIMMIKAN

Terima kasih atas minat Anda untuk berkontribusi pada PERGIMMIKAN! 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)

---

## 📜 Code of Conduct

Proyek ini mengikuti [Code of Conduct](CODE_OF_CONDUCT.md). Dengan berpartisipasi, Anda diharapkan untuk menjunjung tinggi kode etik ini.

---

## 🤝 How Can I Contribute?

### 🐛 Reporting Bugs

Jika Anda menemukan bug:

1. **Cek Issues** - Pastikan bug belum dilaporkan
2. **Buat Issue Baru** dengan informasi:
   - Deskripsi jelas tentang bug
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots (jika ada)
   - Environment (OS, browser, Node version)

### 💡 Suggesting Features

Untuk mengusulkan fitur baru:

1. **Cek Issues** - Pastikan fitur belum diusulkan
2. **Buat Feature Request** dengan:
   - Deskripsi fitur yang jelas
   - Use case dan manfaat
   - Mockup atau wireframe (jika ada)

### 🔧 Code Contributions

1. **Fork** repository
2. **Clone** fork Anda
3. **Create branch** untuk fitur/fix Anda
4. **Make changes** dengan mengikuti coding standards
5. **Test** perubahan Anda
6. **Commit** dengan pesan yang jelas
7. **Push** ke fork Anda
8. **Create Pull Request**

---

## 🛠️ Development Setup

### Prerequisites

- Node.js >= 16.x
- MySQL >= 8.0
- Git

### Setup

```bash
# Clone repository
git clone https://github.com/Tole2404/pergimmikan.git
cd pergimmikan

# Setup backend
cd server
npm install
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Setup frontend
cd ../frontend
npm install
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Setup database
mysql -u root -p < database/MOUNTAIN-TRACKS-SCHEMA.sql
```

### Running

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

---

## 📝 Coding Standards

### JavaScript/React

- Gunakan **ES6+** syntax
- Gunakan **functional components** dan hooks
- Gunakan **arrow functions** untuk callbacks
- Gunakan **destructuring** untuk props
- Gunakan **template literals** untuk string interpolation

### Naming Conventions

```javascript
// Components - PascalCase
const UserProfile = () => {};

// Functions - camelCase
const getUserData = () => {};

// Constants - UPPER_SNAKE_CASE
const API_BASE_URL = 'http://localhost:5000';

// Files
// Components: PascalCase.jsx (UserProfile.jsx)
// Utils: camelCase.js (apiService.js)
// Styles: kebab-case.css (user-profile.css)
```

### Code Style

```javascript
// ✅ Good
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const response = await api.post('/users', data);
    console.log('Success:', response.data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// ❌ Bad
function handleSubmit(e) {
  e.preventDefault()
  api.post('/users', data).then(response => {
    console.log('Success:', response.data)
  }).catch(error => {
    console.error('Error:', error)
  })
}
```

### Comments

```javascript
// ✅ Good - Explain WHY, not WHAT
// Calculate distance using Haversine formula for accurate GPS coordinates
const distance = calculateDistance(lat1, lon1, lat2, lon2);

// ❌ Bad - Obvious comment
// Set user to null
const user = null;
```

### ESLint

Jalankan ESLint sebelum commit:

```bash
# Backend
cd server
npm run lint

# Frontend
cd frontend
npm run lint
```

---

## 📝 Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: Fitur baru
- **fix**: Bug fix
- **docs**: Perubahan dokumentasi
- **style**: Format, missing semicolons, dll (bukan CSS)
- **refactor**: Refactoring code
- **test**: Menambah test
- **chore**: Update tasks, dependencies, dll

### Examples

```bash
# Feature
git commit -m "feat(auth): add JWT authentication"

# Bug fix
git commit -m "fix(gallery): resolve image upload error"

# Documentation
git commit -m "docs(readme): update installation guide"

# Refactor
git commit -m "refactor(api): simplify error handling"
```

### Best Practices

- Gunakan **present tense** ("add feature" bukan "added feature")
- Gunakan **imperative mood** ("move cursor to..." bukan "moves cursor to...")
- Limit subject line ke **50 karakter**
- Capitalize subject line
- Tidak perlu titik di akhir subject
- Pisahkan subject dan body dengan blank line
- Wrap body di **72 karakter**
- Jelaskan **what** dan **why**, bukan **how**

---

## 🔄 Pull Request Process

### Before Submitting

1. **Update** dokumentasi jika perlu
2. **Test** semua perubahan
3. **Run linter** dan fix semua issues
4. **Update** CHANGELOG.md (jika ada)
5. **Rebase** dengan branch utama

### PR Title

Gunakan format yang sama dengan commit message:

```
feat(auth): add social media login
fix(gallery): resolve image loading issue
```

### PR Description

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Manual testing done
- [ ] No console errors

## Screenshots (if applicable)
Add screenshots here

## Related Issues
Closes #123
```

### Review Process

1. **Automated checks** harus pass
2. **Code review** dari maintainer
3. **Requested changes** harus diperbaiki
4. **Approval** dari minimal 1 maintainer
5. **Merge** oleh maintainer

### After Merge

- Delete branch Anda
- Update local repository
- Celebrate! 🎉

---

## 🧪 Testing

### Backend Tests

```bash
cd server
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### Manual Testing Checklist

- [ ] Login/logout works
- [ ] CRUD operations work
- [ ] Notifications appear
- [ ] Comments & reactions work
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Cross-browser compatible

---

## 📚 Resources

### Documentation

- [React Documentation](https://reactjs.org/docs)
- [Express Documentation](https://expressjs.com/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Sequelize Documentation](https://sequelize.org/docs)

### Style Guides

- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [React/JSX Style Guide](https://github.com/airbnb/javascript/tree/master/react)

### Tools

- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Postman](https://www.postman.com/)

---

## ❓ Questions?

Jika ada pertanyaan:

- 💬 Buka [Discussion](https://github.com/Tole2404/pergimmikan/discussions)
- 📧 Email: your.email@example.com
- 💬 Telegram: @yourusername

---

## 🙏 Thank You!

Terima kasih telah berkontribusi pada PERGIMMIKAN! Setiap kontribusi, sekecil apapun, sangat berarti bagi kami. 💙

---

**Happy Coding! 🚀**
