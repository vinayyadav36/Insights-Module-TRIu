export interface User {
  id: string;
  email: string;
  passwordHash: string; // Salted hash
  role: 'admin' | 'user';
  profileVisibility?: 'public' | 'private';
  createdAt: string;
  updatedAt: string;
}

export interface PublicProfile {
  id: string;
  email: string;
  displayName: string;
  role: string;
  title?: string;
  publicPages: Partial<PageConfig>[];
}

export interface BlockTemplate {
  id: string;
  type: string; // e.g., 'hero', 'features', 'cta'
  name: string;
  defaultData: Record<string, any>;
  schema?: Record<string, any>; // Optional schema to render form fields
}

export interface PageBlock {
  id: string;
  type: string; // References BlockTemplate type
  data: Record<string, any>;
  order: number;
}

export interface PageConfig {
  id: string;
  userId: string;
  slug: string;
  title: string;
  description: string;
  blocks: PageBlock[];
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}
