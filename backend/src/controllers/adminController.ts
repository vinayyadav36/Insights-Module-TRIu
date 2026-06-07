import { Request, Response } from 'express';
import { readData, writeData } from '../storage/index.js';
import { User, PageConfig } from '../shared/types/index.js';

const USERS_FILE = 'users/users.json';
const PAGES_FILE = 'product/pages.json';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await readData<User>(USERS_FILE);
    const safeUsers = users.map(({ passwordHash, ...user }) => user);
    res.json(safeUsers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to load users' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (role !== 'admin' && role !== 'user') {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const users = await readData<User>(USERS_FILE);
    const userIndex = users.findIndex(u => u.id === id);

    if (userIndex === -1) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    users[userIndex].role = role;
    await writeData(USERS_FILE, users);

    res.json({ message: 'Role updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update role' });
  }
};

export const getPublicProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const users = await readData<User>(USERS_FILE);
    const user = users.find(u => u.id === id);

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // In a real app, this would check profile visibility settings
    const allPages = await readData<PageConfig>(PAGES_FILE);
    const publicPages = allPages.filter(p => p.userId === id && p.isPublished);

    const displayName = user.email.split('@')[0];

    // Build the public response. DO NOT include private fields like email.
    res.json({
      id: user.id,
      role: user.role, // Safe for public context if intended to show "Admin" badge etc
      displayName: displayName,
      publicPages: publicPages.map(p => ({
        slug: p.slug,
        title: p.title,
        description: p.description
      }))
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to load public profile' });
  }
};
