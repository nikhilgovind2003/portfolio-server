# Project-Skill Associations API

This document describes the many-to-many relationship between Projects and Skills in the portfolio API.

## Database Schema

### Junction Table: `ProjectSkills`
- `project_id` (Foreign Key → projects.id)
- `skill_id` (Foreign Key → skills.id)

## API Endpoints

### Projects with Skills

#### Get All Projects (with associated skills)
```http
GET /api/projects
```
**Response:**
```json
[
  {
    "id": 1,
    "title": "E-commerce Website",
    "description": "Full-stack e-commerce platform",
    "media_path": "projects/project-1.jpg",
    "media_alt": "E-commerce website screenshot",
    "status": true,
    "sort_order": 1,
    "skills": [
      {
        "id": 1,
        "skills": "React",
        "status": true,
        "sort_order": 1
      },
      {
        "id": 2,
        "skills": "Node.js",
        "status": true,
        "sort_order": 2
      }
    ]
  }
]
```

#### Get Single Project (with associated skills)
```http
GET /api/projects/:id
```

#### Create Project (with skills)
```http
POST /api/projects
Content-Type: multipart/form-data

{
  "title": "New Project",
  "description": "Project description",
  "media_alt": "Alt text",
  "status": true,
  "sort_order": 1,
  "skills": [1, 2, 3]  // Array of skill IDs
}
```

#### Update Project (with skills)
```http
PUT /api/projects/:id
Content-Type: multipart/form-data

{
  "title": "Updated Project",
  "skills": [1, 3, 5]  // Array of skill IDs
}
```

#### Add Skills to Project
```http
POST /api/projects/:id/skills
Content-Type: application/json

{
  "skillIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skills added to project successfully",
  "project": {
    "id": 1,
    "title": "Project Title",
    "skills": [...]
  }
}
```

#### Remove Skills from Project
```http
DELETE /api/projects/:id/skills
Content-Type: application/json

{
  "skillIds": [1, 3]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Skills removed from project successfully",
  "project": {
    "id": 1,
    "title": "Project Title",
    "skills": [...]
  }
}
```

### Skills with Projects

#### Get All Skills (with associated projects)
```http
GET /api/skills
```
**Response:**
```json
[
  {
    "id": 1,
    "skills": "React",
    "status": true,
    "sort_order": 1,
    "projects": [
      {
        "id": 1,
        "title": "E-commerce Website",
        "description": "Full-stack e-commerce platform",
        "status": true,
        "sort_order": 1
      }
    ]
  }
]
```

#### Get Single Skill (with associated projects)
```http
GET /api/skills/:id
```

#### Get Projects by Skill
```http
GET /api/skills/:id/projects
```
**Response:**
```json
{
  "skill": {
    "id": 1,
    "skills": "React",
    "status": true,
    "sort_order": 1
  },
  "projects": [
    {
      "id": 1,
      "title": "E-commerce Website",
      "description": "Full-stack e-commerce platform",
      "status": true,
    "sort_order": 1
    }
  ]
}
```

## Usage Examples

### Frontend Integration

#### Display Projects with Skills
```javascript
// Fetch projects with skills
const response = await fetch('/api/projects');
const projects = await response.json();

projects.forEach(project => {
  console.log(`Project: ${project.title}`);
  console.log('Skills:', project.skills.map(skill => skill.skills).join(', '));
});
```

#### Display Skills with Project Count
```javascript
// Fetch skills with projects
const response = await fetch('/api/skills');
const skills = await response.json();

skills.forEach(skill => {
  console.log(`Skill: ${skill.skills} (${skill.projects.length} projects)`);
});
```

#### Filter Projects by Skill
```javascript
// Get projects for a specific skill
const skillId = 1;
const response = await fetch(`/api/skills/${skillId}/projects`);
const data = await response.json();

console.log(`Projects using ${data.skill.skills}:`);
data.projects.forEach(project => {
  console.log(`- ${project.title}`);
});
```

#### Manage Project-Skill Associations
```javascript
// Add skills to a project
const addSkills = async (projectId, skillIds) => {
  const response = await fetch(`/api/projects/${projectId}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillIds })
  });
  return response.json();
};

// Remove skills from a project
const removeSkills = async (projectId, skillIds) => {
  const response = await fetch(`/api/projects/${projectId}/skills`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillIds })
  });
  return response.json();
};
```

## Database Operations

### Sequelize Methods Available

#### On Project Instance
- `project.getSkills()` - Get all skills for a project
- `project.addSkills(skillIds)` - Add skills to project
- `project.removeSkills(skillIds)` - Remove skills from project
- `project.setSkills(skillIds)` - Replace all skills for project

#### On Skill Instance
- `skill.getProjects()` - Get all projects for a skill
- `skill.addProjects(projectIds)` - Add projects to skill
- `skill.removeProjects(projectIds)` - Remove projects from skill
- `skill.setProjects(projectIds)` - Replace all projects for skill

## Validation Rules

### Project-Skill Association Validation
- `skillIds` must be an array
- All skill IDs must be integers
- Project ID must be a valid integer

### Error Responses
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "skillIds",
      "message": "Skill IDs must be an array"
    }
  ]
}
```

## Best Practices

1. **Always include associations** when fetching data for display
2. **Use specific endpoints** for association management rather than updating entire entities
3. **Validate skill IDs** before making association requests
4. **Handle errors gracefully** when skills or projects don't exist
5. **Use transactions** for complex association operations (if needed)

## Performance Considerations

- Associations are loaded with `through: { attributes: [] }` to exclude junction table data
- Use `include` only when you need the associated data
- Consider pagination for large datasets
- Index the foreign keys in the junction table for better performance
