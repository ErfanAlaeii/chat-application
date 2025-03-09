import { z } from "zod";


export const sendMessageSchema = z.object({
  conversationId: z.string().uuid({ message: "Invalid conversation ID" }),
  content: z.string().optional(),
  fileUrl: z.string().url({ message: "Invalid file URL" }).optional(),
});


export const editMessageSchema = z.object({
  messageId: z.string().uuid({ message: "Invalid message ID" }),
  newContent: z.string().min(1, "New content is required"),
});


export const messageIdParamSchema = z.object({
  messageId: z.string().uuid({ message: "Invalid message ID" }),
});


export const conversationIdParamSchema = z.object({
  conversationId: z.string().uuid({ message: "Invalid conversation ID" }),
});
