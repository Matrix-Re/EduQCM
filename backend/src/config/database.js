import "dotenv/config";
import { PrismaClient } from "@prisma/client";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is missing. Make sure backend/.env exists."
  );
}

const prisma = new PrismaClient();

async function connectDatabase() {
  await prisma.$connect();
}

async function disconnectDatabase() {
  await prisma.$disconnect();
}

export {
  prisma,
  connectDatabase,
  disconnectDatabase,
};