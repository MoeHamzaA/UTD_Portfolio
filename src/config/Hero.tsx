import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';
import AWS from '@/components/technologies/AWS';
import Docker from '@/components/technologies/Docker';
import Kubernetes from '@/components/technologies/Kubernetes';
import Python from '@/components/technologies/Python';
import Terraform from '@/components/technologies/Terraform';

// Component mapping for skills
export const skillComponents = {
  Kubernetes: Kubernetes,
  Terraform: Terraform,
  Docker: Docker,
  AWS: AWS,
  Python: Python,
};

export const heroConfig = {
  // Personal Information
  name: 'Hamza Ajmal',
  title: 'DevOps Engineer.',
  avatar: '/assets/hamza.jpg',

  // Skills Configuration
  skills: [
    {
      name: 'Kubernetes',
      href: 'https://kubernetes.io/',
      component: 'Kubernetes',
    },
    {
      name: 'Terraform',
      href: 'https://developer.hashicorp.com/terraform',
      component: 'Terraform',
    },
    {
      name: 'Docker',
      href: 'https://www.docker.com/',
      component: 'Docker',
    },
    {
      name: 'AWS',
      href: 'https://aws.amazon.com/',
      component: 'AWS',
    },
    {
      name: 'Python',
      href: 'https://www.python.org/',
      component: 'Python',
    },
  ],

  // Description Configuration
  description: {
    template:
      'I build reliable CI/CD pipelines, scalable cloud infrastructure, and observability platforms with {skills:0}, {skills:1}, {skills:2}, {skills:3} and {skills:4}. DevOps Engineer at <b>General Dynamics Mission Systems–Canada</b>, incoming DevOps at <b>SOTI</b>.',
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
    href: 'https://www.linkedin.com/in/hamza-ajmal1/',
    icon: <LinkedIn />,
  },
  {
    name: 'Github',
    href: 'https://github.com/MoeHamzaA',
    icon: <Github />,
  },
  {
    name: 'Email',
    href: 'mailto:hamzajmal@outlook.com',
    icon: <Mail />,
  },
];
