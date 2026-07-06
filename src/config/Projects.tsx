import AWS from '@/components/technologies/AWS';
import Docker from '@/components/technologies/Docker';
import Flask from '@/components/technologies/Flask';
import Go from '@/components/technologies/Go';
import Python from '@/components/technologies/Python';
import Terraform from '@/components/technologies/Terraform';
import { Project } from '@/types/project';

export const projects: Project[] = [
  {
    title: 'Elva',
    description:
      "Full-stack AI assistant for Alzheimer's support — facial recognition, object detection, and NLP for real-time identification and guidance. HackHive 2025 winning project.",
    image: '/project/elva.png',
    link: 'https://github.com/MoeHamzaA/Elva',
    technologies: [
      { name: 'Python', icon: <Python key="python" /> },
      { name: 'Flask', icon: <Flask key="flask" /> },
      { name: 'Docker', icon: <Docker key="docker" /> },
    ],
    github: 'https://github.com/MoeHamzaA/Elva',
    details: true,
    projectDetailsPageSlug: '/projects/elva',
    isWorking: true,
  },
  {
    title: 'CloudPulse-AI',
    description:
      'Go-based observability system for AI workloads — model drift, latency, and system health with 92% drift-detection accuracy, 30% faster deployments, and 70% faster incident response.',
    image: '/project/cloudpulse-ai.png',
    link: 'https://github.com/MoeHamzaA/CloudPulse-AI',
    technologies: [
      { name: 'Go', icon: <Go key="go" /> },
      { name: 'AWS', icon: <AWS key="aws" /> },
      { name: 'Docker', icon: <Docker key="docker" /> },
      { name: 'Terraform', icon: <Terraform key="terraform" /> },
    ],
    github: 'https://github.com/MoeHamzaA/CloudPulse-AI',
    details: true,
    projectDetailsPageSlug: '/projects/cloudpulse-ai',
    isWorking: true,
  },
  {
    title: 'Smart Notes',
    description:
      'AI-powered study tool that converts lecture videos into organized, searchable notes using multithreaded transcription, with flashcard generation and AI chat support.',
    image: '/project/smart-notes.png',
    link: 'https://github.com/MoeHamzaA/Smart-Notes',
    technologies: [
      { name: 'Python', icon: <Python key="python" /> },
      { name: 'Flask', icon: <Flask key="flask" /> },
    ],
    github: 'https://github.com/MoeHamzaA/Smart-Notes',
    details: true,
    projectDetailsPageSlug: '/projects/smart-notes',
    isWorking: true,
  },
  {
    title: 'Trash It',
    description:
      'HackHive 2024 winning project — containerized computer vision app on Azure that analyzes photos to identify recyclable objects using OpenCV and Azure Computer Vision.',
    image: '/project/trash-it.png',
    link: 'https://trash-it.azurewebsites.net/',
    technologies: [
      { name: 'Python', icon: <Python key="python" /> },
      { name: 'Docker', icon: <Docker key="docker" /> },
    ],
    github: 'https://github.com/MoeHamzaA/Trash-It',
    live: 'https://trash-it.azurewebsites.net/',
    details: true,
    projectDetailsPageSlug: '/projects/trash-it',
    isWorking: true,
  },
  {
    title: 'Cloud Anomaly Detection',
    description:
      'Scalable ML-powered cloud monitoring solution detecting anomalies in real-time resource usage with Isolation Forest, AWS SageMaker, Lambda, and automated SNS alerts.',
    image: '/project/anomaly-detection.png',
    link: 'https://github.com/MoeHamzaA/Cloud-Monitoring-Anomaly-Detection',
    technologies: [
      { name: 'AWS', icon: <AWS key="aws" /> },
      { name: 'Python', icon: <Python key="python" /> },
    ],
    github: 'https://github.com/MoeHamzaA/Cloud-Monitoring-Anomaly-Detection',
    details: true,
    projectDetailsPageSlug: '/projects/anomaly-detection',
    isWorking: true,
  },
];
