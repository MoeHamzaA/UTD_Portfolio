import AWS from '@/components/technologies/AWS';
import Ansible from '@/components/technologies/Ansible';
import Docker from '@/components/technologies/Docker';
import GitLab from '@/components/technologies/GitLab';
import Github from '@/components/technologies/Github';
import Go from '@/components/technologies/Go';
import GoogleCloud from '@/components/technologies/GoogleCloud';
import Grafana from '@/components/technologies/Grafana';
import Kubernetes from '@/components/technologies/Kubernetes';
import NodeJs from '@/components/technologies/NodeJs';
import Python from '@/components/technologies/Python';
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
    company: 'General Dynamics Mission Systems–Canada',
    position: 'DevOps Engineer',
    location: 'Ottawa, Ontario',
    image: '/company/gdms.png',
    description: [
      'Architected a centralized CI/CD observability platform on Grafana and Loki, aggregating pipeline telemetry from 100+ GitLab repositories to cut failure-investigation time across teams.',
      'Built real-time CI telemetry pipelines in Python against the GitLab API, running ~96 scheduled executions per day and streaming structured logs into centralized logging infrastructure.',
      'Engineered pipeline flakiness detection by correlating repeated runs per commit SHA, and layered AI-driven diagnostics on top for log summarization, failure classification, and root-cause analysis.',
      'Drove adoption of GitLab merge queues and CI gating policies across 50+ repositories, keeping shared branches stable under concurrent development.',
      'Automate platform infrastructure with Go, Terraform, Ansible, and VMware vSphere, including scheduled enforcement of VM resource-allocation policies.',
    ],
    startDate: 'September 2025',
    endDate: 'Present',
    website: 'https://gdmissionsystems.com/canada',
    technologies: [
      {
        name: 'GitLab CI',
        href: 'https://about.gitlab.com/',
        icon: <GitLab />,
      },
      { name: 'Grafana', href: 'https://grafana.com/', icon: <Grafana /> },
      { name: 'Python', href: 'https://www.python.org/', icon: <Python /> },
      { name: 'Go', href: 'https://go.dev/', icon: <Go /> },
      {
        name: 'Terraform',
        href: 'https://developer.hashicorp.com/terraform',
        icon: <Terraform />,
      },
      { name: 'Ansible', href: 'https://www.ansible.com/', icon: <Ansible /> },
    ],
  },
  {
    isCurrent: false,
    company: 'AthenaGuard',
    position: 'DevOps Engineer',
    location: 'Toronto, Ontario',
    image: '/company/athenaguard.jpeg',
    description: [
      'Automated build, test, and deployment workflows with GitHub Actions CI/CD pipelines.',
      'Set up weekly dependency-audit workflows that improved system stability and reduced security vulnerabilities.',
      'Containerized applications with Docker for consistent environments from development through production.',
      'Supported secure, scalable infrastructure with Node.js, Python, REST APIs, and OWASP practices.',
    ],
    startDate: 'May 2025',
    endDate: 'September 2025',
    website: '',
    technologies: [
      {
        name: 'GitHub Actions',
        href: 'https://github.com/features/actions',
        icon: <Github />,
      },
      { name: 'Docker', href: 'https://www.docker.com/', icon: <Docker /> },
      { name: 'Python', href: 'https://www.python.org/', icon: <Python /> },
      { name: 'Node.js', href: 'https://nodejs.org/', icon: <NodeJs /> },
    ],
  },
  {
    isCurrent: false,
    company: 'Vosyn',
    position: 'Cloud Engineer',
    location: 'Toronto, Ontario',
    image: '/company/vosyn.jpeg',
    description: [
      'Scaled GCP infrastructure for production and AI-driven workloads, improving reliability and cutting latency by 25%.',
      'Optimized resource provisioning with Terraform and Kubernetes, lowering infrastructure costs and accelerating deployments.',
      'Presented infrastructure recommendations that shaped three executive-level decisions on GCP architecture and resource allocation.',
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
    position: 'DevOps Engineer',
    location: 'Remote',
    image: '/company/wouessi.jpeg',
    description: [
      'Provisioned AWS infrastructure with Terraform and CloudFormation, reducing environment drift between development and staging.',
      'Implemented GitHub Actions CI/CD pipelines for automated testing and releases on a two-week sprint cycle.',
      'Refactored backend APIs, cutting system response time by 45% for 200+ users.',
    ],
    startDate: 'January 2025',
    endDate: 'March 2025',
    website: 'https://wouessi.com',
    technologies: [
      { name: 'AWS', href: 'https://aws.amazon.com/', icon: <AWS /> },
      {
        name: 'Terraform',
        href: 'https://developer.hashicorp.com/terraform',
        icon: <Terraform />,
      },
      {
        name: 'GitHub Actions',
        href: 'https://github.com/features/actions',
        icon: <Github />,
      },
    ],
  },
  {
    isCurrent: false,
    company: 'Santek Micro Solutions',
    position: 'DevOps Engineer',
    location: 'Ajax, Ontario',
    image: '/company/santek.jpeg',
    description: [
      'Built and deployed an AI-powered resume chatbot with Django and NLP, improving candidate success rates by 40%, with CI/CD workflows for automated deployment.',
      'Developed ML pipelines on AWS processing 10,000+ emails, improving customer satisfaction by 20%.',
      'Automated cloud security workflows for IAM, WAF, and access-control policies, strengthening security posture and deployment consistency.',
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
