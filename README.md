# DeutschFlow

DeutschFlow helps learners master the German language by breaking down complex grammar and vocabulary into interactive lessons. It takes users through a structured curriculum, tracking their progress, streaks, and experience points to maintain motivation. There is no guesswork involved, just a clear path from the basics to conversational fluency.

## Usage

Users interact with the mobile application to complete language exercises. The interface presents a learning path where users can select their current unit and work through sections like vocabulary, grammar explanations, and listening drills. 

The client application communicates with the backend to verify answers and update user statistics. A typical interaction involves sending an answer to the server for validation.

The request payload contains the user's response:
```json
{
  "response": "lerne"
}
```

The server processes the attempt and returns the updated progress state:
```json
{
  "result": {
    "isCorrect": true,
    "score": 100,
    "xpEarned": 5,
    "activityCompleted": true,
    "sectionCompleted": false,
    "unitCompleted": false
  }
}
```

## Features

*   **Structured Curriculum**: Organizes learning material into structured paths, units, and localized sections based on the CEFR language framework.
*   **Interactive Exercises**: Supports multiple activity types including multiple-choice, fill-in-the-blank, conjugation, and sentence building.
*   **Progress Tracking**: Monitors daily streaks, experience points, and lesson mastery to keep learners engaged.
*   **Audio Pronunciation**: Utilizes native text-to-speech capabilities to help users practice their listening skills.
*   **Secure Authentication**: Manages user sessions securely using Clerk integration.

## Technologies Used

| Technology | Description |
| :--- | :--- |
| React Native | Cross-platform mobile framework |
| Expo | Development platform for React Native |
| TypeScript | Strongly typed programming language |
| Tailwind CSS | Utility-first styling framework via NativeWind |
| Node.js | Backend JavaScript runtime |
| Express | Web application framework for the API |
| Prisma | Next-generation ORM for Node.js |
| PostgreSQL | Relational database for persistent storage |
| Clerk | Authentication and user management |

## API Documentation

The backend API handles all curriculum delivery and progress tracking. All endpoints except the health check require a valid Bearer token provided by Clerk.

#### GET /api/health
**Description**: Checks the health status of the API and database connection.

**Response**:
```json
{
  "status": "ok",
  "database": "connected"
}
```

#### GET /api/users/me
**Description**: Retrieves the current authenticated user profile and overall learning progress. It creates a new user record if one does not exist.

**Response**:
```json
{
  "user": {
    "id": "cuid_123",
    "clerkId": "user_456",
    "email": "user@example.com",
    "profile": {
      "firstName": "John",
      "lastName": "Doe"
    },
    "learningProgress": {
      "level": 1,
      "xp": 150,
      "streak": 3,
      "lessonsCompleted": 5
    }
  }
}
```

#### GET /api/lessons
**Description**: Returns a list of all published lessons ordered by level and sequence.

**Response**:
```json
{
  "lessons": [
    {
      "id": "a1-lesson-1",
      "title": "Greetings",
      "level": 1,
      "order": 1,
      "isPublished": true
    }
  ]
}
```

#### GET /api/lessons/continue
**Description**: Fetches the next incomplete lesson for the user to resume their learning journey.

**Response**:
```json
{
  "lesson": {
    "id": "a1-lesson-2",
    "title": "Numbers",
    "progress": 50,
    "completed": false
  }
}
```

#### GET /api/lessons/path
**Description**: Retrieves the sequence of lessons along with the user lock status and completion progress for each item.

**Response**:
```json
{
  "path": [
    {
      "id": "a1-lesson-1",
      "title": "Greetings",
      "status": "completed",
      "progress": 100,
      "locked": false
    },
    {
      "id": "a1-lesson-2",
      "title": "Numbers",
      "status": "current",
      "progress": 50,
      "locked": false
    }
  ]
}
```

#### GET /api/units/path
**Description**: Gets the high-level curriculum path including units and their respective progress statistics.

**Response**:
```json
{
  "path": {
    "id": "path_1",
    "slug": "german-foundations",
    "name": "German Foundations",
    "units": [
      {
        "id": "unit-1",
        "title": "What is different in German?",
        "status": "current",
        "progress": 25,
        "locked": false
      }
    ]
  }
}
```

#### GET /api/units/:id
**Description**: Retrieves the complete details of a specific unit including its sections, activities, and vocabulary links.

**Response**:
```json
{
  "unit": {
    "id": "unit-1",
    "title": "What is different in German?",
    "sections": [
      {
        "id": "sec-1",
        "type": "EXPLAINER",
        "title": "See the pattern",
        "activities": []
      }
    ]
  }
}
```

#### POST /api/activities/:id/attempt
**Description**: Submits a user answer for a specific activity, validates it, and updates experience points and mastery scores.

**Request**:
```json
{
  "response": "lerne"
}
```

**Response**:
```json
{
  "result": {
    "isCorrect": true,
    "score": 100,
    "xpEarned": 5,
    "activityCompleted": true,
    "sectionCompleted": false,
    "unitCompleted": false,
    "progress": {
      "activity": {
        "completed": true,
        "bestScore": 100
      }
    }
  }
}
```

**Errors**:
*   400: Response payload is missing.
*   401: Unauthorized request.
*   404: User or Activity not found.

## Contributing

Contributions are always welcome. Please ensure your code matches the existing formatting and type definitions. Open an issue first to discuss significant changes or architectural updates before submitting a pull request.

## Author Info

Developed by the DeutschFlow Team.

## Badges

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)](https://expressjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

[![Readme was generated by Dokugen](https://img.shields.io/badge/Readme%20was%20generated%20by-Dokugen-brightgreen)](https://dokugen.samueltuoyo.com)