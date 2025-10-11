# React Best Practices Project

A well-structured React project following modern best practices, built with Vite.

## Features

- 📁 Organized folder structure
- 🎨 Tailwind CSS for styling
- 🛣️ React Router for navigation
- 🔧 ESLint & Prettier configuration
- 🌍 Environment variables setup
- 📦 Modern React practices (Hooks, Functional Components)

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── assets/        # Static assets
├── styles/        # Global styles and CSS modules
├── utils/         # Utility functions
├── routes/        # Route configurations
├── services/      # API services
└── context/       # React Context/State management
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and fill in your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Best Practices Implemented

- Functional Components with Hooks
- Proper folder structure for scalability
- Component-based architecture
- CSS organization with Tailwind
- Environment variable management
- Code quality tools (ESLint, Prettier)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT
