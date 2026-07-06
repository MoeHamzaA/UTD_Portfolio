import AWS from '@/components/technologies/AWS';
import Docker from '@/components/technologies/Docker';
import Figma from '@/components/technologies/Figma';
import Github from '@/components/technologies/Github';
import GoogleCloud from '@/components/technologies/GoogleCloud';
import Kubernetes from '@/components/technologies/Kubernetes';
import MongoDB from '@/components/technologies/MongoDB';
import NodeJs from '@/components/technologies/NodeJs';
import Python from '@/components/technologies/Python';
import ReactIcon from '@/components/technologies/ReactIcon';
import Terraform from '@/components/technologies/Terraform';

export interface Technology {
  name: string;
  href: string;
  icon: React.ReactNode;
}

export interface Experience {
  company: string;
  position: string;
  location: string;
  image: string;
  description: string[];
  startDate: string;
  endDate: string;
  website: string;
  x?: string;
  linkedin?: string;
  github?: string;
  technologies: Technology[];
  isCurrent: boolean;
  isBlur?: boolean;
}

export const experiences: Experience[] = [
  {
    isCurrent: true,
    company: 'AthenaGuard',
    position: 'Software Developer',
    location: 'Ontario, Canada',
    image: '/company/athenaguard.jpeg',
    description: [
      'Built and maintained CI/CD pipelines using GitHub Actions to automate builds, run tests, catch syntax errors, and streamline deployment workflows.',
      'Developed automated workflows to update and audit project dependencies weekly, improving system stability and reducing security vulnerabilities.',
      'Utilized Docker to containerize applications, ensuring consistent environments across development and production, and making the stack cloud-deployment ready.',
      'Worked with Node.js, Python, and REST APIs, integrating secure coding practices (OWASP Top 10) and collaborating with cross-functional teams to support scalable infrastructure.',
    ],
    startDate: 'May 2025',
    endDate: 'Present',
    website: '',
    technologies: [
      { name: 'Python', href: 'https://www.python.org/', icon: <Python /> },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      { name: 'Docker', href: 'https://www.docker.com/', icon: <Docker /> },
      {
        name: 'GitHub Actions',
        href: 'https://github.com/features/actions',
        icon: <Github />,
      },
    ],
  },
  {
    isCurrent: false,
    company: 'Vosyn',
    position: 'Cloud Engineer',
    location: 'Ontario, Canada',
    image: '/company/vosyn.jpeg',
    description: [
      'Collaborated with the cloud engineering team to design, deploy, and manage scalable infrastructure on Google Cloud Platform (GCP).',
      'Optimized cloud environments for performance, security, and cost-efficiency using Terraform and Kubernetes.',
      'Contributed to internal documentation for cloud architecture and operational procedures during IPO preparation.',
      'Researched and applied emerging trends in Cloud, DevOps, and MLOps to support AI-driven infrastructure solutions.',
      'Engaged directly with senior leadership and the advisory board on innovative, cloud-native projects in a fast-paced startup environment.',
    ],
    startDate: 'April 2025',
    endDate: 'June 2025',
    website: 'https://vosyn.ai',
    technologies: [
      {
        name: 'Google Cloud',
        href: 'https://cloud.google.com/',
        icon: <GoogleCloud />,
      },
      {
        name: 'Terraform',
        href: 'https://developer.hashicorp.com/terraform',
        icon: <Terraform />,
      },
      {
        name: 'Kubernetes',
        href: 'https://kubernetes.io/',
        icon: <Kubernetes />,
      },
    ],
  },
  {
    isCurrent: false,
    company: 'Wouessi Digital',
    position: 'Software Engineer',
    location: 'Ontario, Canada',
    image: '/company/wouessi.jpeg',
    description: [
      'Collaborated in a cross-functional team to develop a full-stack Employee Management System (EMS), streamlining HR operations such as onboarding, payroll, timesheets, and leave tracking.',
      'Built and integrated core features like employee CRUD, onboarding workflows, and real-time leave and timesheet modules using Node.js and MongoDB.',
      'Contributed to UI/UX design with Figma and React, delivering responsive, user-friendly interfaces.',
      'Participated in testing, deployment through AWS, and Git version control, ensuring successful MVP delivery.',
    ],
    startDate: 'January 2025',
    endDate: 'March 2025',
    website: 'https://wouessi.com',
    technologies: [
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
      { name: 'MongoDB', href: 'https://www.mongodb.com/', icon: <MongoDB /> },
      { name: 'React', href: 'https://react.dev/', icon: <ReactIcon /> },
      { name: 'AWS', href: 'https://aws.amazon.com/', icon: <AWS /> },
      { name: 'Figma', href: 'https://figma.com/', icon: <Figma /> },
    ],
  },
  {
    isCurrent: false,
    company: 'Santek Micro Solutions',
    position: 'Cloud Engineer',
    location: 'Ontario, Canada',
    image: '/company/santek.jpeg',
    description: [
      'Implemented CI/CD to automate the deployment of cloud security policies including IAM roles, security groups, and WAF rules complying with ISO and NIST standards.',
      'Developed a custom AI-powered chatbot for the company website using NLP, capable of scanning and modifying resumes based on user requests.',
      'Utilized machine learning models to generate personalized emails and store them in a cloud database.',
    ],
    startDate: 'January 2024',
    endDate: 'December 2024',
    website: '',
    technologies: [
      { name: 'AWS', href: 'https://aws.amazon.com/', icon: <AWS /> },
      { name: 'Python', href: 'https://www.python.org/', icon: <Python /> },
    ],
  },
];
