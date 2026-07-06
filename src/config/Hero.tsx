import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';
import AWS from '@/components/technologies/AWS';
import Docker from '@/components/technologies/Docker';
import NodeJs from '@/components/technologies/NodeJs';
import Python from '@/components/technologies/Python';
import TypeScript from '@/components/technologies/TypeScript';

// Component mapping for skills
export const skillComponents = {
  Python: Python,
  AWS: AWS,
  Docker: Docker,
  NodeJs: NodeJs,
  TypeScript: TypeScript,
};

export const heroConfig = {
  // Personal Information
  name: 'Hamza Ajmal',
  title: 'Backend, AI & Cloud engineer.',
  avatar: '/assets/hamza.jpg',

  // Skills Configuration
  skills: [
    {
      name: 'Python',
      href: 'https://www.python.org/',
      component: 'Python',
    },
    {
      name: 'AWS',
      href: 'https://aws.amazon.com/',
      component: 'AWS',
    },
    {
      name: 'Docker',
      href: 'https://www.docker.com/',
      component: 'Docker',
    },
    {
      name: 'Node.js',
      href: 'https://nodejs.org/',
      component: 'NodeJs',
    },
    {
      name: 'TypeScript',
      href: 'https://www.typescriptlang.org/',
      component: 'TypeScript',
    },
  ],

  // Description Configuration
  description: {
    template:
      'I build scalable backend systems, AI-driven solutions, and cloud infrastructure with {skills:0}, {skills:1}, {skills:2}, {skills:3} and {skills:4}. Focused on <b>MLOps</b> and <b>cloud-native</b> architecture.',
  },

  // Buttons Configuration
  buttons: [
    {
      variant: 'default',
      text: 'Get in touch',
      href: '/contact',
      icon: 'Chat',
    },
  ],
};

// Social Links Configuration
export const socialLinks = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/in/hamza-ajmal-166a8228b/',
    icon: <LinkedIn />,
  },
  {
    name: 'Github',
    href: 'https://github.com/MoeHamzaA',
    icon: <Github />,
  },
  {
    name: 'Email',
    href: 'mailto:mhamzaajmal9@gmail.com',
    icon: <Mail />,
  },
];
