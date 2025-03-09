import { Request, Response } from "express";
import {
  sendMessage,
  getMessagesByConversation,
  editMessage,
  deleteMessage,
  markMessageAsRead
} from "../services/message.Service";
import {
  sendMessageSchema,
  editMessageSchema,
  messageIdParamSchema,
  conversationIdParamSchema
} from "../validations/message.validation";
import logger from "../utils/logger";

export async function sendMessageController(req: Request, res: Response) {
  const validation = sendMessageSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { conversationId, content, fileUrl } = validation.data;
    const senderId = req.user.id;
    const message = await sendMessage(conversationId, senderId, content, fileUrl);
    res.status(201).json(message);
  } catch (error) {
    logger.error({error})
    res.status(400).json({ message: (error as Error).message });
  }
}


export async function getMessagesController(req: Request, res: Response) {
  const validationId = conversationIdParamSchema.safeParse(req.params.conversationId)
  if(!validationId.success){
    return res.status(400).json({errors:validationId.error.format()});
  }
  try {
    const conversationId = validationId.data.conversationId;
    const messages = await getMessagesByConversation(conversationId);
    res.status(200).json(messages);
  } catch (error) {
    logger.error({error})
    res.status(400).json({ message: (error as Error).message });
  }
}


export async function editMessageController(req: Request, res: Response) {
  const validation = editMessageSchema.safeParse(req.body)
  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.format() });
  }
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { messageId, newContent } = validation.data;
    const senderId = req.user.id;
    const result = await editMessage(messageId, senderId, newContent);
    if (result.count === 0) {
      return res.status(404).json({ message: "Message not found or unauthorized" });
    }
    res.status(200).json({ message: "Message updated successfully" });
  } catch (error) {
    logger.error({error})
    res.status(400).json({ message: (error as Error).message });
  }
}


export async function deleteMessageController(req: Request, res: Response) {
  const validationId = messageIdParamSchema.safeParse(req.params)
  if (!validationId.success) {
    return res.status(400).json({ errors: validationId.error.format() });
  }
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { messageId } = validationId.data;
    const senderId = req.user.id;
    const result = await deleteMessage(messageId, senderId);
    if (result.count === 0) {
      return res.status(404).json({ message: "Message not found or unauthorized" });
    }
    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    logger.error({error})
    res.status(400).json({ message: (error as Error).message });
  }
}


export async function markMessageAsReadController(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { messageId } = req.params;
    const userId = req.user.id;
    const updatedMessage = await markMessageAsRead(messageId, userId);
    res.status(200).json(updatedMessage);
  } catch (error) {
    logger.error({error})
    res.status(400).json({ message: (error as Error).message });
  }
}
