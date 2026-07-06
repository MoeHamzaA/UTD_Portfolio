import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';

export const contactConfig = {
  title: 'Contact',
  description:
    "Have a project, role, or idea in mind? Reach out directly — I'll get back to you as soon as possible.",
  email: 'hamzajmal@outlook.com',
  links: [
    {
      name: 'Email',
      value: 'hamzajmal@outlook.com',
      href: 'mailto:hamzajmal@outlook.com',
      icon: <Mail />,
    },
    {
      name: 'LinkedIn',
      value: 'in/hamza-ajmal1',
      href: 'https://www.linkedin.com/in/hamza-ajmal1/',
      icon: <LinkedIn />,
    },
    {
      name: 'GitHub',
      value: 'MoeHamzaA',
      href: 'https://github.com/MoeHamzaA',
      icon: <Github />,
    },
  ],
};
