import { PrismaClient } from '@prisma/client';

// Declare a global variable for PrismaClient
declare global {
    // Ensure this is the only declaration of the prisma variable
    // Use var instead of let/const to prevent block-scoping issues
    // eslint-disable-next-line no-var
    var prisma: PrismaClient | undefined;
}

// Export the PrismaClient instance, using the existing global instance if available
export const db = globalThis.prisma || new PrismaClient();

// If not in production, attach the PrismaClient instance to globalThis
if (process.env.NODE_ENV !== 'production') {
    globalThis.prisma = db;
}
