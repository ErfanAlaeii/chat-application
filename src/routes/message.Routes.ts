import express from 'express';
import {
    sendMessageController,
    editMessageController,
    getMessagesController,
    deleteMessageController,
    markMessageAsReadController
} from '../controllers/message.Controller';
import { jwtAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', jwtAuth, sendMessageController);

router.get('/conversation/:conversationId', jwtAuth, getMessagesController);


router.put('/edit', jwtAuth, editMessageController);

router.delete('/:messageId', jwtAuth, deleteMessageController);


router.patch('/:messageId/read', jwtAuth, markMessageAsReadController);

export default router;