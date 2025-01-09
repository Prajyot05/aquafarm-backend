# Aquafarm Backend

A backend service for the Aquafarm project built with Node.js, Express, and TypeScript.

## Prerequisites

- Node.js (LTS version recommended)
- npm or yarn package manager
- MongoDB instance

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Development Tools**: ESLint, Prettier, Nodemon

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd aquafarm-backend
```

2. Install dependencies:
```bash
npm install
```

## Available Scripts

- `npm start` - Run the compiled application
- `npm run build` - Compile TypeScript to JavaScript
- `npm run watch` - Watch for TypeScript changes and compile
- `npm run dev` - Run the application in development mode with hot reload
- `npm run lint` - Run ESLint checks
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format:check` - Check code formatting with Prettier
- `npm run format:fix` - Fix code formatting issues automatically

## Development

The project uses several development tools to maintain code quality:

- **TypeScript** for static typing
- **ESLint** for code linting
- **Prettier** for code formatting
- **lint-staged** for pre-commit hooks
- **nodemon** for development hot-reload

## Project Structure

```
src/
  ├── app.ts        # Application entry point
  ├── routes/       # API routes
  ├── models/       # Database models
  ├── controllers/  # Route controllers
  ├── middleware/   # Custom middleware
  └── config/       # Configuration files
```
