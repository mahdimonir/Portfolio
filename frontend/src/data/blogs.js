export const blogs = [
  {
    id: 1,
    title: "Building Modern Web Applications with React and TypeScript",
    excerpt:
      "Learn how to leverage TypeScript's powerful type system to build more robust and maintainable React applications.",
    content: `
# Building Modern Web Applications with React and TypeScript

In today's rapidly evolving web development landscape, building robust and maintainable applications is more important than ever. This comprehensive guide will walk you through the process of creating modern web applications using React and TypeScript.

## Why TypeScript with React?

TypeScript brings static type checking to JavaScript, which helps catch errors early in development and provides better tooling support. When combined with React, it creates a powerful development experience that scales well for large applications.

### Key Benefits:

- **Early Error Detection**: Catch type-related errors during development
- **Better IDE Support**: Enhanced autocomplete and refactoring capabilities
- **Improved Code Documentation**: Types serve as inline documentation
- **Enhanced Team Collaboration**: Clear interfaces and contracts

## Setting Up Your Development Environment

First, let's set up a new React TypeScript project:

\`\`\`bash
npx create-react-app my-app --template typescript
cd my-app
npm start
\`\`\`

This creates a new React application with TypeScript configuration out of the box.

## Component Architecture

When building React components, consider the following example:

\`\`\`javascript
const UserCard = ({ name, email, isActive = true }) => {
  return (
    <div className="user-card">
      <h3>{name}</h3>
      <p>{email}</p>
      <span className={isActive ? 'active' : 'inactive'}>
        {isActive ? 'Active' : 'Inactive'}
      </span>
    </div>
  );
};
\`\`\`

## State Management

Here's an example of state management in a JavaScript-based React project:

\`\`\`javascript
import { useState } from 'react';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      const userData = await response.json();
      setUsers(userData);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li>
          ))}
        </ul>
      )}
      <button onClick={fetchUsers}>Fetch Users</button>
    </div>
  );
};
\`\`\`

## Best Practices

Here are some best practices when working with React:

1. **Component Reusability**: Create reusable components
2. **State Management**: Use hooks or state libraries appropriately
3. **Performance Optimization**: Use memoization and lazy loading
4. **Accessibility**: Follow a11y guidelines
5. **Code Organization**: Maintain a clean project structure

## Conclusion

React forms a powerful foundation for building modern web applications. By following the patterns and practices outlined in this guide, you'll be well on your way to building robust, maintainable React applications.
    `,
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["React", "TypeScript", "Web Development", "JavaScript", "Frontend"],
    category: "Tutorial",
    author: {
      name: "Moniruzzaman Mahdi",
      avatar: "https://avatars.githubusercontent.com/u/159605851?v=4",
      bio: "Full Stack MERN Developer & UI/UX Designer",
    },
  },
  {
    id: 2,
    title: "The Future of Full-Stack Development: MERN Stack in 2024",
    excerpt:
      "Exploring the current state and future prospects of the MERN stack for modern web development.",
    content:
      "The MERN stack continues to evolve, offering developers powerful tools...",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop",
    date: "2024-01-10",
    readTime: "12 min read",
    tags: ["MERN", "MongoDB", "Express", "Node.js"],
    category: "Technology",
    author: {
      name: "Jane Smith",
      avatar: "https://via.placeholder.com/150",
      bio: "Backend Developer",
    },
  },
  {
    id: 3,
    title: "Optimizing React Performance: Tips and Best Practices",
    excerpt:
      "Discover essential techniques for improving your React application's performance and user experience.",
    content:
      "Performance optimization is crucial for modern React applications...",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
    date: "2024-01-05",
    readTime: "10 min read",
    tags: ["React", "Performance", "Optimization"],
    category: "Best Practices",
    author: {
      name: "Alex Johnson",
      avatar: "https://via.placeholder.com/150",
      bio: "Frontend Specialist",
    },
  },
  {
    id: 4,
    title: "CSS Grid vs Flexbox: When to Use Each Layout Method",
    excerpt:
      "A comprehensive guide to understanding the differences between CSS Grid and Flexbox and when to use each.",
    content:
      "CSS Grid and Flexbox are powerful layout tools, each with unique strengths...",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
    date: "2024-01-20",
    readTime: "6 min read",
    tags: ["CSS", "Layout", "Frontend"],
    category: "Tutorial",
    author: {
      name: "Moniruzzaman Mahdi",
      avatar: "https://avatars.githubusercontent.com/u/159605851?v=4",
      bio: "Full Stack MERN Developer & UI/UX Designer",
    },
  },
];

export const getBlogById = (id) => {
  return blogs.find((blog) => blog.id === parseInt(id)) || null;
};
