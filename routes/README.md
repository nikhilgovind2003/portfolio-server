# API Routes Documentation

This directory contains the route files organized using kebab-case naming convention.

## File Structure

```
routes/
├── index.js          # Main router that mounts all sub-routes
├── users.js          # User management routes
├── skills.js         # Skills management routes
├── projects.js       # Projects management routes
└── README.md         # This documentation file
```

## Route Naming Convention

- **File names**: Use kebab-case (e.g., `user-profiles.js`, `project-skills.js`)
- **Route paths**: Use kebab-case in URLs (e.g., `/api/user-profiles`, `/api/project-skills`)
- **Entity names**: Use camelCase in code (e.g., `userProfiles`, `projectSkills`)

## Available Endpoints

### Health Check
- `GET /api/health` - Server health status

### Users (`/api/users`)
- `GET /api/users` - Get all users
- `POST /api/users` - Create a new user
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Skills (`/api/skills`)
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create a new skill
- `GET /api/skills/:id` - Get skill by ID
- `PUT /api/skills/:id` - Update skill by ID
- `DELETE /api/skills/:id` - Delete skill by ID
- `GET /api/skills/:id/projects` - Get projects that use this skill

### Projects (`/api/projects`)
- `GET /api/projects` - Get all projects with their skills
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get project by ID with skills
- `PUT /api/projects/:id` - Update project by ID
- `DELETE /api/projects/:id` - Delete project by ID
- `POST /api/projects/:id/skills` - Add skills to a project
- `DELETE /api/projects/:id/skills` - Remove skills from a project

## Usage Examples

### Creating a Project with Skills
```bash
POST /api/projects
Content-Type: application/json

{
  "title": "My Portfolio Website",
  "description": "A modern portfolio website built with React",
  "media_path": "/images/portfolio.jpg",
  "media_alt": "Portfolio website screenshot",
  "skill_ids": [1, 2, 3]
}
```

### Adding Skills to an Existing Project
```bash
POST /api/projects/1/skills
Content-Type: application/json

{
  "skill_ids": [4, 5, 6]
}
```

### Getting Projects with Their Skills
```bash
GET /api/projects
```

## Error Handling

All routes include proper error handling and return appropriate HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (for successful deletions)
- `404` - Not Found
- `500` - Internal Server Error

## Adding New Routes

To add new routes following the kebab-case convention:

1. Create a new file: `routes/your-entity-name.js`
2. Define your routes in the file
3. Import and mount the router in `routes/index.js`:
   ```javascript
   const yourEntityRouter = require('./your-entity-name');
   router.use('/your-entity-name', yourEntityRouter);
   ```

