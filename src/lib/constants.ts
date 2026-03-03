export const CHART_COLORS = [
  '#2563eb', '#7c3aed', '#db2777', '#ea580c',
  '#16a34a', '#0891b2', '#4f46e5', '#c026d3',
  '#d97706', '#059669', '#6366f1', '#e11d48',
];

export const EDITOR_COLORS: Record<string, string> = {
  vscode: '#007ACC',
  'visual studio': '#5C2D91',
  neovim: '#57A143',
  jetbrains: '#FF318C',
  vim: '#019733',
  emacs: '#7F5AB6',
  xcode: '#147EFB',
  eclipse: '#2C2255',
};

export const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: 'LayoutDashboard' },
  { href: '/completions', label: 'Code Completions', icon: 'Code' },
  { href: '/chat', label: 'Chat', icon: 'MessageSquare' },
  { href: '/pull-requests', label: 'Pull Requests', icon: 'GitPullRequest' },
  { href: '/members', label: 'Members', icon: 'Users' },
] as const;

export const DEFAULT_DATE_RANGE_DAYS = 28;
