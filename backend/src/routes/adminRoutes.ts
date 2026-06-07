import { Router } from 'express';
import { getUsers, updateUserRole, getPublicProfile } from '../controllers/adminController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { Request, Response, NextFunction } from 'express';

const router = Router();

// Middleware to enforce super admin
const requireAdmin = (req: any, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    res.status(403).json({ error: 'Super Admin access required' });
    return;
  }
  next();
};

router.get('/users', authenticate, requireAdmin, getUsers);
router.put('/users/:id/role', authenticate, requireAdmin, updateUserRole);

// Public profile route doesn't require auth
router.get('/public/:id', getPublicProfile);

export default router;
