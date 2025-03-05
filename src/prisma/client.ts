import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function checkDatabaseConnection(): Promise<void> {
  try {
    await prisma.$connect();
    console.log("Successfully connected");
  } catch (error) {
    console.error("The connection to the database could not be established.", error);
  } finally {
    await prisma.$disconnect();
  }
}

export default prisma;
