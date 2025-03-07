import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function createConversationServices(creatorId: string, participantIds: string[], isGroup: boolean, name?: string) {
  const participants = participantIds.map((userId) => ({ userId }));
  if (!isGroup) name = undefined;

  const conversation = await prisma.conversation.create({
    data: {
      isGroup,
      name,
      participants: {
        create: [...participants, { userId: creatorId }],
      },
    },
    include: { participants: true },
  });
  return conversation;
}



export async function getConversationsByUser(userId: string) {
  const conversations = await prisma.conversation.findMany({
    where: {
      participants: {
        some: { userId },
      },
    },
    include: { participants: true },
  });
  return conversations;
}

export async function getConversationByIdServices(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: { participants: true, messages: true },
  });

  if (!conversation) {
    throw new Error("Conversation not found");
  }

  const isParticipant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId },
    },
  });

  if (!isParticipant) {
    throw new Error("Access denied");
  }

  return conversation;
}

export async function addUserToConversationServices(conversationId: string, userId: string, requesterId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });

  if (!conversation || !conversation.isGroup) {
    throw new Error("Invalid group conversation");
  }


  const isRequesterParticipant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: requesterId },
    },
  });

  if (!isRequesterParticipant) {
    throw new Error("Only participants can add new members");
  }


  const newParticipant = await prisma.conversationParticipant.create({
    data: { conversationId, userId },
  });

  return newParticipant;
}

export async function removeUserFromConversationServices(conversationId: string, userId: string, requesterId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });

  if (!conversation || !conversation.isGroup) {
    throw new Error("Invalid group conversation");
  }


  const isRequesterParticipant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId, userId: requesterId },
    },
  });

  if (!isRequesterParticipant) {
    throw new Error("Only participants can remove members");
  }


  await prisma.conversationParticipant.delete({
    where: {
      conversationId_userId: { conversationId, userId },
    },
  });

  return { message: "User removed from conversation" };
}

export async function deleteConversationServices(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) {
    throw new Error("Conversation not found");
  }

  if (conversation.isGroup) {
    throw new Error("Cannot delete a group conversation directly");
  }

  await prisma.conversation.delete({ where: { id: conversationId } });
  return { message: "Conversation deleted successfully" };
}
