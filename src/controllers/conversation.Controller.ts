import { Request, Response } from 'express';
import {
  createConversationServices,
  getConversationByIdServices,
  getConversationsByUser,
  addUserToConversationServices,
  removeUserFromConversationServices,
  deleteConversationServices
} from '../services/conversation.Service';
import { createConversationSchema } from '../validations/conversation.validation';

export async function createConversation(req: Request, res: Response) {
  const validateData = createConversationSchema.safeParse(req.body)
  if (!validateData.success) {
    return res.status(400).json({ errors: validateData.error.format() })
  }
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { participantIds, isGroup, name } = validateData.data
    const creatorId = req.user.id;
    const conversation = await createConversationServices(
      creatorId,
      participantIds,
      isGroup,
      name
    );
    res.status(201).json(conversation);
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}

export async function getConversations(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const userId = req.user.id;
    const conversations = await getConversationsByUser(userId);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export async function getConversationById(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversationId = req.params.id;
    const conversation = await getConversationByIdServices(conversationId, req.user.id);

    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    res.json(conversation);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
}

export async function addUserToConversation(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { conversationId, userId } = req.body;
    const updatedConversation = await addUserToConversationServices(conversationId, userId, req.user.id);

    res.status(200).json({ message: "User added to conversation", updatedConversation });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}


export async function removeUserFromConversation(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { conversationId, userId } = req.body;
    const updatedConversation = await removeUserFromConversationServices(conversationId, userId, req.user.id);

    res.status(200).json({ message: "User removed from conversation", updatedConversation });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}


export async function deleteConversation(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const conversationId = req.params.id;
    await deleteConversationServices(conversationId, req.user.id);

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: (error as Error).message });
  }
}


