export const NAV_ITEMS = [
  ['Home', '/'], ['About', '/about'], ['Team', '/team'], ['Projects', '/projects'],
  ['Services', '/services'], ['Technologies', '/technologies'], ['Process', '/process'],
  ['Contact', '/contact'],
] as const;

export type SitePath = typeof NAV_ITEMS[number][1];

export const TEAM = [
  {
    name: 'Oleksandr Balarnovich', country: 'Colombia', initials: 'OB',
    role: 'Senior Full Stack Software Engineer',
    summary: 'Senior engineer focused on reliable, end-to-end software products and cloud-ready delivery.',
    strengths: ['Full-stack architecture', 'Product delivery', 'Cloud & DevOps'],
    skills: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'AWS', 'Docker', 'Laravel', 'PHP', 'Vue', 'React Native', 'Django', 'Rust', 'Go', 'Java'],
    link: 'https://www.linkedin.com/in/oleksandr-balanovichy-1b9255393/',
  },
  {
    name: 'Nakashima Radon', country: 'Japan', initials: 'NR',
    role: 'Senior Web, Blockchain & Unity Developer',
    summary: 'Senior developer spanning immersive web, game development, blockchain systems, and cloud infrastructure.',
    strengths: ['Interactive experiences', 'Blockchain engineering', 'Game development'],
    skills: ['Unity', 'Unreal Engine', 'WebGL', 'Blockchain', 'React', 'Vue', 'Laravel', 'Node.js', 'AWS', 'Docker', 'Azure', 'Firebase', 'Solidity', 'Web3', 'Rust', 'Go', 'MongoDB', 'MySQL', 'Blender', 'Maya', 'C#', 'C++', 'Python'],
    link: 'https://otw-nr.web.app/',
  },
  {
    name: 'Daniel Andres Viloria', country: 'Ukraine', initials: 'DV',
    role: 'Team Manager',
    summary: 'Leads project planning, client communication, team management, and delivery coordination across the team.',
    strengths: ['Project planning', 'Client communication', 'Agile workflow', 'Team leadership', 'Delivery coordination'],
    skills: ['Team leadership', 'Project coordination', 'Client communication', 'Agile planning', 'Delivery coordination'],
    link: 'https://danielviloria2801.vercel.app/',
  },
] as const;
