# How to Set Skills Under Projects

## 🎯 Quick Examples

### **1. Set Skills When Creating a Project**
```bash
curl -X POST http://localhost:4000/api/projects \
  -F "title=My Portfolio Website" \
  -F "description=A modern portfolio website built with React and Node.js" \
  -F "media_alt=Portfolio website screenshot" \
  -F "status=true" \
  -F "sort_order=1" \
  -F "skills=[1,2,3]" \
  -F "media_path=@/path/to/image.jpg"
```

### **2. Set Skills for Existing Project (Replace All)**
```bash
curl -X PUT http://localhost:4000/api/projects/1/skills \
  -H "Content-Type: application/json" \
  -d '{"skills": [1, 2, 3, 4]}'
```

### **3. Add Skills to Existing Project**
```bash
curl -X POST http://localhost:4000/api/projects/1/skills \
  -H "Content-Type: application/json" \
  -d '{"skillIds": [5, 6]}'
```

### **4. Remove Skills from Project**
```bash
curl -X DELETE http://localhost:4000/api/projects/1/skills \
  -H "Content-Type: application/json" \
  -d '{"skillIds": [1, 2]}'
```

## 📝 JavaScript Examples

### **Frontend Integration**

#### Create Project with Skills
```javascript
const createProjectWithSkills = async (projectData, skillIds) => {
  const formData = new FormData();
  formData.append('title', projectData.title);
  formData.append('description', projectData.description);
  formData.append('media_alt', projectData.media_alt);
  formData.append('status', projectData.status);
  formData.append('sort_order', projectData.sort_order);
  formData.append('skills', JSON.stringify(skillIds)); // [1, 2, 3]
  formData.append('media_path', projectData.file);

  const response = await fetch('/api/projects', {
    method: 'POST',
    body: formData
  });
  
  return response.json();
};

// Usage
const newProject = await createProjectWithSkills({
  title: "E-commerce App",
  description: "Full-stack e-commerce application",
  media_alt: "E-commerce app screenshot",
  status: true,
  sort_order: 1,
  file: selectedFile
}, [1, 2, 3, 4]); // Skill IDs
```

#### Set Skills for Existing Project
```javascript
const setProjectSkills = async (projectId, skillIds) => {
  const response = await fetch(`/api/projects/${projectId}/skills`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skills: skillIds })
  });
  
  return response.json();
};

// Usage
await setProjectSkills(1, [1, 3, 5]); // Replace all skills with these
```

#### Add Skills to Project
```javascript
const addSkillsToProject = async (projectId, skillIds) => {
  const response = await fetch(`/api/projects/${projectId}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ skillIds: skillIds })
  });
  
  return response.json();
};

// Usage
await addSkillsToProject(1, [6, 7]); // Add these skills to existing ones
```

## 🔍 Check Results

### **Get Project with Skills**
```javascript
const getProjectWithSkills = async (projectId) => {
  const response = await fetch(`/api/projects/${projectId}`);
  const project = await response.json();
  
  console.log(`Project: ${project.title}`);
  console.log('Skills:', project.skills.map(skill => skill.skills).join(', '));
  
  return project;
};
```

### **Get All Projects with Skills**
```javascript
const getAllProjectsWithSkills = async () => {
  const response = await fetch('/api/projects');
  const projects = await response.json();
  
  projects.forEach(project => {
    console.log(`\n${project.title}:`);
    project.skills.forEach(skill => {
      console.log(`  - ${skill.skills}`);
    });
  });
  
  return projects;
};
```

## 📊 API Response Examples

### **Successful Skill Setting**
```json
{
  "success": true,
  "message": "Skills set for project successfully",
  "project": {
    "id": 1,
    "title": "E-commerce App",
    "description": "Full-stack e-commerce application",
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
      },
      {
        "id": 3,
        "skills": "MongoDB",
        "status": true,
        "sort_order": 3
      }
    ]
  }
}
```

## ⚠️ Important Notes

1. **Skill IDs must exist** - Make sure the skill IDs you're using actually exist in the database
2. **Array format** - Skills must be provided as an array of integers
3. **Replace vs Add** - `PUT /:id/skills` replaces all skills, `POST /:id/skills` adds to existing
4. **File uploads** - When creating/updating projects with files, use `multipart/form-data`

## 🧪 Test Your Setup

1. **Create some skills first:**
```bash
curl -X POST http://localhost:4000/api/skills \
  -H "Content-Type: application/json" \
  -d '{"skills": "React", "status": true, "sort_order": 1}'
```

2. **Then create a project with those skills:**
```bash
curl -X POST http://localhost:4000/api/projects \
  -F "title=Test Project" \
  -F "description=Test Description" \
  -F "media_alt=Test Alt" \
  -F "status=true" \
  -F "sort_order=1" \
  -F "skills=[1]"
```

3. **Check the result:**
```bash
curl http://localhost:4000/api/projects/1
```
