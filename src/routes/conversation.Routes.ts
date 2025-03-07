import express from 'express';
import {
    createConversation,
    getConversations,
    getConversationById,
    addUserToConversation,
    removeUserFromConversation,
    deleteConversation,
  } from "../controllers/conversation.Controller";
import { jwtAuth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', jwtAuth, createConversation);
router.get('/', jwtAuth, getConversations);
router.get("/:id", jwtAuth, getConversationById);
router.post("/add-user", jwtAuth, addUserToConversation);
router.post("/remove-user", jwtAuth, removeUserFromConversation); 
router.delete("/:id", jwtAuth, deleteConversation); 

export default router;