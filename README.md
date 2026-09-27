# Smart Study Planner

## Overview

Smart Study Planner is a calm, practical academic planning workspace for students. It brings tasks, subjects, exams, classes, study sessions, and calendar events into one responsive frontend.

The current application uses realistic mock data. Backend APIs, authentication, persistence, and authorization are intentionally left for the next development stage.

## Features

- Student dashboard with schedule, priorities, exams, and study activity
- Task creation, search and filter UI, priorities, and completion states
- Subject progress cards
- Upcoming and past exam overview
- Weekly class timetable with conflict-checking placeholder UI
- Study session planning and weekly statistics
- Combined calendar view
- Profile and notification preferences
- Basic teacher timetable and sharing interface
- Responsive navigation for desktop and mobile

## Tech Stack

- Next.js 16 (App Router; compatible with the requested Next.js 15 patterns)
- TypeScript
- React
- Tailwind CSS v4
- Lucide React
- MongoDB/Mongoose (planned backend, not implemented in this frontend)

## Architecture

```text
Browser
	↓
Next.js Frontend
	↓
Backend API (to be implemented)
	↓
MongoDB
```

## Project Structure

- `app/` contains App Router pages and the existing backend routes
- `components/` contains the application shell and reusable UI components
- `lib/mock-data.ts` contains realistic frontend-only records
- `lib/frontend-data.ts` contains placeholder data functions to replace with API calls
- `types/` contains the shared domain interfaces
- `public/` contains static assets

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000` in a browser. Run the checks with:

```bash
pnpm lint
pnpm build
```

## Environment Variables

The frontend does not currently require additional environment variables.

## Screenshots

Screenshots can be added here as the project evolves.

## Future Backend Integration

Replace the functions in `lib/frontend-data.ts` with calls to the REST API. Components already consume typed entities from `types/index.ts`, so the visual structure should not need to change when mock records are replaced with server data.

The backend will own MongoDB, Mongoose, authentication, authorization, password hashing, validation, resource ownership, and business logic.

## Future Features

- Notifications
- Offline support
- Teacher timetable sharing
- More advanced analytics
- Mobile application

## License

This project is for learning and portfolio purposes.
