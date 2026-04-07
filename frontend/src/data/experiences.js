export const experiences = [
  {
    id: 1,
    role: "Senior Full Stack Developer",
    company: "TechFlow Solutions",
    period: "2022 - Present",
    location: "San Francisco, CA",
    description:
      "Leading development of next-generation web applications using cutting-edge technologies. Architecting scalable microservices and mentoring cross-functional teams.",
    skills: ["React", "Node.js", "AWS", "TypeScript", "Docker"],
    achievements: [
      "Built platform serving 500K+ users",
      "Reduced load times by 65%",
      "Led team of 8 developers",
    ],
  },
  {
    id: 2,
    role: "Full Stack Developer",
    company: "InnovateLab",
    period: "2020 - 2022",
    location: "New York, NY",
    description:
      "Developed responsive web applications and RESTful APIs. Collaborated with UX/UI teams to deliver pixel-perfect implementations.",
    skills: ["Vue.js", "Python", "PostgreSQL", "GraphQL", "Redis"],
    achievements: [
      "Delivered 25+ client projects",
      "Improved API performance by 40%",
      "Maintained 99.9% uptime",
    ],
  },
  {
    id: 3,
    role: "Frontend Developer",
    company: "StartupVenture",
    period: "2019 - 2020",
    location: "Austin, TX",
    description:
      "Specialized in creating interactive user interfaces and optimizing user experience. Worked closely with product managers to implement feature requirements.",
    skills: ["Angular", "JavaScript", "SCSS", "Firebase", "Jest"],
    achievements: [
      "Increased user engagement by 80%",
      "Built component library",
      "Reduced bundle size by 50%",
    ],
  },
  {
    id: 4,
    role: "Junior Developer",
    company: "WebCraft Agency",
    period: "2018 - 2019",
    location: "Remote",
    description:
      "Started my journey building custom websites and learning modern development practices. Focused on creating responsive designs and clean code.",
    skills: ["HTML5", "CSS3", "JavaScript", "WordPress", "Git"],
    achievements: [
      "Built 15+ websites",
      "Learned 5 new frameworks",
      "Achieved 95% client satisfaction",
    ],
  },
];

export const getExperienceById = (id) => {
  return (
    experiences.find((experience) => experience.id === parseInt(id)) || null
  );
};
