# Portfolio Server API

A Node.js/Express server with PostgreSQL database for managing portfolio content including CMS, projects, skills, and users.

## Features

- **CMS Management**: Manage website content and media
- **Projects**: CRUD operations for portfolio projects with skill associations
- **Skills**: Manage technical skills with project relationships
- **Users**: User management system
- **File Uploads**: Image upload handling with Multer
- **Database**: PostgreSQL with Sequelize ORM
- **Validation**: Request validation with express-validator
- **Logging**: Winston logger with file and console output
- **Error Handling**: Centralized error handling middleware

## API Endpoints

### Health Check
- `GET /health` - Server health status

### CMS
- `GET /api/cms` - Get CMS content
- `PUT /api/cms` - Update CMS content (with file upload)

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get project by ID
- `POST /api/projects` - Create new project (with file upload)
- `PUT /api/projects/:id` - Update project (with file upload)
- `DELETE /api/projects/:id` - Delete project

### Skills
- `GET /api/skills` - Get all skills
- `POST /api/skills` - Create new skill
- `PUT /api/skills/:id` - Update skill
- `DELETE /api/skills/:id` - Delete skill

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the server directory:

```env
# Server Configuration
PORT=4000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio_db
DB_USER=postgres
DB_PASS=postgres
DB_SSL=false

# Alternative: Use DATABASE_URL for production
# DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
```

### 2. Database Setup

1. Install PostgreSQL
2. Create a database named `portfolio_db`
3. Update the database credentials in your `.env` file

### 3. Install Dependencies

```bash
npm install
```

### 4. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:4000` (or the port specified in your `.env` file).

## Database Schema

### Users Table
- `id` (Primary Key)
- `name` (String)
- `email` (String, Unique)
- `created_at`, `updated_at` (Timestamps)

### CMS Table
- `id` (Primary Key)
- `super_title`, `title`, `description` (Strings)
- `btn_one_text`, `btn_one_link`, `btn_two_text`, `btn_two_link` (Strings)
- `media_path`, `media_alt` (Strings)
- `project_title`, `skills_title`, `about_title`, `about_description`, `contact_title` (Strings)
- `created_at`, `updated_at` (Timestamps)

### Projects Table
- `id` (Primary Key)
- `title`, `description`, `media_alt` (Strings)
- `media_path` (Text)
- `status` (Boolean)
- `sort_order` (Integer)
- `created_at`, `updated_at` (Timestamps)

### Skills Table
- `id` (Primary Key)
- `skills` (String)
- `status` (Boolean)
- `sort_order` (Integer)
- `created_at`, `updated_at` (Timestamps)

### ProjectSkills Table (Junction)
- `project_id` (Foreign Key)
- `skill_id` (Foreign Key)

## File Uploads

- Uploaded files are stored in the `uploads/` directory
- Each route type has its own subdirectory (e.g., `uploads/cms/`, `uploads/projects/`)
- Files are automatically renamed with timestamps to prevent conflicts
- Old files are automatically deleted when new ones are uploaded

## Error Handling

The server includes comprehensive error handling:
- Validation errors return 422 status with detailed messages
- Database errors are logged and return appropriate HTTP status codes
- File upload errors are handled gracefully
- All errors are logged using Winston logger

## Logging

Logs are written to:
- `combined.log` - All log levels
- `error.log` - Error level only
- Console output (development mode only)

## Development

### Project Structure
```
server/
├── config/          # Configuration files
├── controller/      # Route controllers
├── middlewares/     # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── uploads/         # File uploads
├── validations/     # Request validations
├── index.js         # Main server file
└── db.js           # Database connection
```

### Adding New Routes

1. Create a new route file in `routes/`
2. Create corresponding controller in `controller/`
3. Add validation rules in `validations/`
4. The dynamic route loader will automatically pick up the new route

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Update CORS origins in `index.js`
3. Use a production database URL
4. Ensure proper file permissions for uploads directory
5. Set up process management (PM2, Docker, etc.)

## Security Considerations

- Input validation on all endpoints
- File upload restrictions (configure in multer middleware)
- CORS properly configured
- Environment variables for sensitive data
- SQL injection protection via Sequelize ORM