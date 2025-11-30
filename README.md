# Shinka CRM

A modern social media platform built with TypeScript, Node.js, PostgreSQL, and Next.js.

## 🏗️ Monorepo Structure

This is a monorepo managed with **npm workspaces**.

```
/
├── packages/
│   └── shared/          # Shared types, schemas, and utilities
├── apps/
│   ├── backend/         # Express API server with PostgreSQL
│   └── frontend/        # Next.js application
└── scripts/             # Build and utility scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- PostgreSQL >= 14

### Installation

```bash
# Install all dependencies
npm install
```

### Environment Setup

1. **Backend**: Copy `apps/backend/.env.example` to `apps/backend/.env` and configure your database
2. **Frontend**: Copy `apps/frontend/.env.local.example` to `apps/frontend/.env.local`

### Development

```bash
# Run all apps in development mode
npm run dev

# Run backend only
npm run dev:backend

# Run frontend only
npm run dev:frontend
```

### Build

```bash
# Build all packages
npm run build

# Build backend only
npm run build:backend

# Build frontend only
npm run build:frontend
```

## 📦 Packages

### `@shinka/shared`
Shared TypeScript types, Zod schemas, and utility functions used across backend and frontend.

### `@shinka/backend`
Express.js REST API with:
- JWT authentication
- PostgreSQL database with Drizzle ORM
- User management
- Posts, comments, likes
- Follow system
- File uploads

### `@shinka/frontend`
Next.js application with:
- User authentication
- News feed
- User profiles
- Post creation and interactions
- Follow/unfollow users

## 🧪 Testing

```bash
npm test
```

## 📝 License

MIT
