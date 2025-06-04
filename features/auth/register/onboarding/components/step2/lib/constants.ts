// Role options with display labels
export const ROLE_OPTIONS = [
  { value: 'frontend', label: 'Frontend Developer', emoji: '🎨' },
  { value: 'backend', label: 'Backend Developer', emoji: '⚙️' },
  { value: 'pm', label: 'Project Manager', emoji: '📋' },
  { value: 'tech-lead', label: 'Tech Lead', emoji: '👨‍💻' },
  { value: 'ux-ui', label: 'UX/UI Designer', emoji: '🎭' },
  { value: 'community-manager', label: 'Community Manager', emoji: '🌐' },
  { value: 'devops', label: 'DevOps Engineer', emoji: '🔧' },
  { value: 'qa', label: 'QA Engineer', emoji: '🧪' },
  { value: 'full-stack', label: 'Full Stack Developer', emoji: '🚀' }
] as const;

// Tech skills with categories for better organization
export const TECH_SKILLS = [
  // Programming Languages
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'PHP',
  'Go',
  'Rust',
  'Swift',
  'Kotlin',
  'Ruby',
  'C++',

  // Frontend Technologies
  'HTML',
  'CSS',
  'React',
  'Angular',
  'Vue.js',
  'Svelte',
  'Next.js',
  'Nuxt.js',
  'Astro',
  'Gatsby',

  // CSS Frameworks & Preprocessors
  'Tailwind CSS',
  'Bootstrap',
  'Sass',
  'Less',
  'Styled Components',
  'Emotion',

  // Backend Frameworks
  'Node.js',
  'Express.js',
  'NestJS',
  'Django',
  'Flask',
  'FastAPI',
  'Spring Boot',
  'ASP.NET Core',
  'Laravel',
  'Ruby on Rails',

  // Databases
  'PostgreSQL',
  'MySQL',
  'MongoDB',
  'Redis',
  'SQLite',
  'Firebase',
  'Supabase',
  'DynamoDB',

  // Cloud & DevOps
  'AWS',
  'Google Cloud',
  'Azure',
  'Docker',
  'Kubernetes',
  'Terraform',
  'Jenkins',
  'GitLab CI',
  'GitHub Actions',

  // Testing
  'Jest',
  'Cypress',
  'Playwright',
  'Selenium',
  'Testing Library',
  'Vitest',

  // Mobile Development
  'React Native',
  'Flutter',
  'Ionic',
  'Xamarin',

  // Other
  'GraphQL',
  'REST API',
  'Microservices',
  'Machine Learning',
  'Data Science',
  'Blockchain',
  'Web3'
] as const;

// Tools and software
export const TOOLS_OPTIONS = [
  // Design Tools
  'Figma',
  'Adobe XD',
  'Sketch',
  'Adobe Photoshop',
  'Adobe Illustrator',
  'Canva',
  'InVision',
  'Principle',

  // Code Editors & IDEs
  'Visual Studio Code',
  'Cursor',
  'WebStorm',
  'IntelliJ IDEA',
  'Sublime Text',
  'Atom',
  'Vim',
  'Emacs',
  'Trae',
  'Winsurf',

  // Project Management
  'Jira',
  'Trello',
  'Asana',
  'Monday.com',
  'Notion',
  'ClickUp',
  'Linear',
  'GitHub Projects',
  'Azure DevOps',

  // Version Control
  'Git',
  'GitHub',
  'GitLab',
  'Bitbucket',
  'SVN',

  // Communication
  'Slack',
  'Discord',
  'Microsoft Teams',
  'Zoom',
  'Google Meet',
  'Miro',
  'Mural',

  // Database Tools
  'pgAdmin',
  'MySQL Workbench',
  'MongoDB Compass',
  'TablePlus',
  'DBeaver',

  // API Tools
  'Postman',
  'Insomnia',
  'Thunder Client',
  'Swagger',

  // Analytics & Monitoring
  'Google Analytics',
  'Mixpanel',
  'Amplitude',
  'Sentry',
  'LogRocket',
  'Datadog',

  // Other
  'Storybook',
  'Chromatic',
  'Vercel',
  'Netlify',
  'Heroku',
  'Railway',
  'PlanetScale',
  'Clerk',
  'Auth0'
] as const;
