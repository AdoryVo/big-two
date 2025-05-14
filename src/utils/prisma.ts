import { Prisma, PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  const globalWithPrisma = global as typeof globalThis & {
    prisma: PrismaClient;
  };
  if (!globalWithPrisma.prisma) {
    globalWithPrisma.prisma = new PrismaClient();
  }
  prisma = globalWithPrisma.prisma;
}

// Type Variations
const gameWithPlayers = Prisma.validator<Prisma.GameDefaultArgs>()({
  include: { players: true, currentPlayer: true, settings: true },
});
export type GameWithPlayers = Prisma.GameGetPayload<typeof gameWithPlayers>;

export default prisma;
