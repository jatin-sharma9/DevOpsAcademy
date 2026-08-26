import express from 'express';
import { createMessage, getMessages, updateMessageStatus, deleteMessage } from '../controllers/contactController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', createMessage);

router.use(protect);
router.use(authorize('admin'));

router.get('/', getMessages);
router.put('/:id/status', updateMessageStatus);
router.delete('/:id', deleteMessage);

export default router;
