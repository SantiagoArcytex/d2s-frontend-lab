/**
 * Mock App Data for Showcase
 * Temporary data for MVP demonstration
 */

export interface MockApp {
  id: string;
  name: string;
  subdomain: string;
  description: string;
  longDescription: string;
  category: string;
  tags: string[];
  status: 'approved' | 'pending_review' | 'rejected' | 'suspended';
  features: string[];
  useCases: string[];
  screenshot?: string;
  icon?: string;
  launchUrl: string;
  created_at: string;
  tagline?: string;
}

export const mockApps: MockApp[] = [
  {
    id: 'mock-1',
    name: 'TaskFlow',
    subdomain: 'taskflow',
    description: 'Streamline your project management with intuitive task tracking and team collaboration.',
    longDescription: 'TaskFlow is a powerful project management application designed to help teams stay organized and productive. With intuitive task tracking, real-time collaboration, and comprehensive reporting, TaskFlow makes managing complex projects simple. Whether you\'re working solo or with a large team, TaskFlow adapts to your workflow and helps you deliver results faster.',
    category: 'Productivity',
    tags: ['project-management', 'collaboration', 'tasks', 'planning'],
    status: 'approved',
    features: [
      'Real-time task tracking and updates',
      'Team collaboration with comments and mentions',
      'Customizable project boards and workflows',
      'Time tracking and productivity analytics',
      'File attachments and document sharing',
      'Mobile apps for iOS and Android',
      'Integrations with popular tools',
    ],
    useCases: [
      'Manage software development sprints and releases',
      'Coordinate marketing campaigns across teams',
      'Track client projects and deliverables',
      'Organize personal tasks and goals',
    ],
    tagline: 'Project management that actually works',
    launchUrl: 'https://taskflow.platform.com',
    created_at: '2024-01-15T10:00:00Z',
  },
  {
    id: 'mock-2',
    name: 'CodeSync',
    subdomain: 'codesync',
    description: 'Developer collaboration platform with real-time code sharing and pair programming tools.',
    longDescription: 'CodeSync revolutionizes how developers collaborate. Built for modern development teams, it provides real-time code sharing, integrated pair programming sessions, and seamless collaboration tools. Share your screen, code together, and solve problems faster. CodeSync integrates with your favorite IDEs and version control systems, making collaboration effortless.',
    category: 'Development',
    tags: ['development', 'collaboration', 'coding', 'pair-programming'],
    status: 'approved',
    features: [
      'Real-time code sharing and editing',
      'Integrated pair programming sessions',
      'Screen sharing with low latency',
      'IDE integrations (VS Code, IntelliJ, etc.)',
      'Version control system integration',
      'Code review and commenting tools',
      'Team chat and voice communication',
    ],
    useCases: [
      'Pair programming sessions with remote team members',
      'Code reviews and collaborative debugging',
      'Onboarding new developers to the codebase',
      'Live coding interviews and technical assessments',
    ],
    tagline: 'Code together, build faster',
    launchUrl: 'https://codesync.platform.com',
    created_at: '2024-01-20T14:30:00Z',
  },
  {
    id: 'mock-3',
    name: 'DataViz',
    subdomain: 'dataviz',
    description: 'Transform your data into beautiful, interactive visualizations and dashboards.',
    longDescription: 'DataViz is a powerful analytics platform that turns complex data into actionable insights. Create stunning visualizations, build interactive dashboards, and share insights with your team. With support for multiple data sources, real-time updates, and customizable charts, DataViz helps you make data-driven decisions faster. Perfect for business intelligence, reporting, and data analysis.',
    category: 'Analytics',
    tags: ['analytics', 'data-visualization', 'dashboards', 'reporting'],
    status: 'approved',
    features: [
      'Interactive charts and graphs',
      'Real-time data updates',
      'Custom dashboard builder',
      'Multiple data source connections',
      'Export to PDF, Excel, and images',
      'Scheduled reports and email alerts',
      'Collaborative dashboards with sharing',
    ],
    useCases: [
      'Business intelligence and KPI tracking',
      'Sales performance monitoring',
      'Marketing campaign analytics',
      'Financial reporting and analysis',
    ],
    tagline: 'See your data, understand your business',
    launchUrl: 'https://dataviz.platform.com',
    created_at: '2024-02-01T09:15:00Z',
  },
  {
    id: 'mock-4',
    name: 'MailMaster',
    subdomain: 'mailmaster',
    description: 'Professional email management with smart organization and powerful search capabilities.',
    longDescription: 'MailMaster is the email client you\'ve been waiting for. With intelligent organization, powerful search, and seamless integration, managing your inbox has never been easier. Features like smart folders, email templates, and automated workflows help you stay on top of your communications. Built for professionals who receive hundreds of emails daily.',
    category: 'Communication',
    tags: ['email', 'communication', 'productivity', 'organization'],
    status: 'approved',
    features: [
      'Smart email organization and filtering',
      'Powerful full-text search across all emails',
      'Email templates and quick replies',
      'Automated workflows and rules',
      'Unified inbox for multiple accounts',
      'Email scheduling and reminders',
      'Read receipts and tracking',
    ],
    useCases: [
      'Manage high-volume email inboxes',
      'Organize customer support communications',
      'Streamline sales email workflows',
      'Coordinate team communications',
    ],
    tagline: 'Email that doesn\'t overwhelm you',
    launchUrl: 'https://mailmaster.platform.com',
    created_at: '2024-02-10T11:45:00Z',
  },
  {
    id: 'mock-5',
    name: 'DocuShare',
    subdomain: 'docushare',
    description: 'Collaborative document editing with real-time updates and version control.',
    longDescription: 'DocuShare brings teams together around documents. Edit together in real-time, track changes, and maintain complete version history. With support for multiple file formats, advanced commenting, and seamless collaboration, DocuShare makes document work effortless. Perfect for teams that need to create, review, and finalize documents together.',
    category: 'Collaboration',
    tags: ['documents', 'collaboration', 'editing', 'sharing'],
    status: 'approved',
    features: [
      'Real-time collaborative editing',
      'Version history and change tracking',
      'Comments and suggestions',
      'Multiple file format support',
      'Document templates library',
      'Access control and permissions',
      'Export to PDF, Word, and more',
    ],
    useCases: [
      'Collaborative writing and editing',
      'Document review and approval workflows',
      'Team knowledge base and documentation',
      'Client proposal and contract creation',
    ],
    tagline: 'Write together, create better',
    launchUrl: 'https://docushare.platform.com',
    created_at: '2024-02-18T16:20:00Z',
  },
  {
    id: 'mock-6',
    name: 'CloudSync',
    subdomain: 'cloudsync',
    description: 'Secure file storage and synchronization across all your devices.',
    longDescription: 'CloudSync provides secure, reliable file storage and synchronization. Your files are always available, whether you\'re at your desk or on the go. With end-to-end encryption, automatic backups, and seamless sync across devices, CloudSync keeps your data safe and accessible. Share files with team members, collaborate on documents, and never lose important files again.',
    category: 'Storage',
    tags: ['storage', 'files', 'sync', 'backup'],
    status: 'approved',
    features: [
      'End-to-end encryption for security',
      'Automatic file synchronization',
      'Version history and file recovery',
      'File sharing with access controls',
      'Mobile apps for all platforms',
      'Large file support (up to 10GB)',
      'Offline access and sync',
    ],
    useCases: [
      'Secure file storage and backup',
      'Team file sharing and collaboration',
      'Personal file synchronization',
      'Document archive and retrieval',
    ],
    tagline: 'Your files, everywhere, securely',
    launchUrl: 'https://cloudsync.platform.com',
    created_at: '2024-02-25T13:00:00Z',
  },
];

/**
 * Get mock app by subdomain
 */
export function getMockAppBySubdomain(subdomain: string): MockApp | undefined {
  return mockApps.find((app) => app.subdomain === subdomain);
}

/**
 * Get mock apps by category
 */
export function getMockAppsByCategory(category: string): MockApp[] {
  return mockApps.filter((app) => app.category === category);
}

/**
 * Get all unique categories
 */
export function getAllCategories(): string[] {
  return Array.from(new Set(mockApps.map((app) => app.category)));
}
