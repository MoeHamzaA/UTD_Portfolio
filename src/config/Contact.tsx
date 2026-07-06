import Github from '@/components/svgs/Github';
import LinkedIn from '@/components/svgs/LinkedIn';
import Mail from '@/components/svgs/Mail';

export const contactConfig = {
  title: 'Contact',
  description:
    "Have a project, role, or idea in mind? Reach out directly — I'll get back to you as soon as possible.",
  email: 'mhamzaajmal9@gmail.com',
  links: [
    {
      name: 'Email',
      value: 'mhamzaajmal9@gmail.com',
      href: 'mailto:mhamzaajmal9@gmail.com',
      icon: <Mail />,
    },
    {
      name: 'LinkedIn',
      value: 'in/hamza-ajmal-166a8228b',
      href: 'https://www.linkedin.com/in/hamza-ajmal-166a8228b/',
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
