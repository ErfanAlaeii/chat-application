import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function sendMessage(conversationId: string, senderId: string, content?: string, fileUrl?: string) {
  const message = await prisma.message.create({
    data: { conversationId, senderId, content, fileUrl },
  });
  return message;
}

export async function getMessagesByConversation(conversationId: string) {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'asc' },
    include: { sender: true },
  });
  return messages;
}

export async function editMessage(messageId: string, senderId: string, newContent: string) {
  const message = await prisma.message.updateMany({
    where: { id: messageId, senderId },
    data: { content: newContent },
  });

  if (message.count === 0) {
    throw new Error("Message not found or unauthorized");
  }

  return message;
}

export async function deleteMessage(messageId: string, senderId: string) {
  const message = await prisma.message.deleteMany({
    where: { id: messageId, senderId },
  });

  if (message.count === 0) {
    throw new Error("Message not found or unauthorized");
  }

  return message;
}


export async function markMessageAsRead(messageId: string, userId: string) {
  return prisma.message.update({
    where: { id: messageId },
    data: { readBy: { connect: { id: userId } } },
  });
}


