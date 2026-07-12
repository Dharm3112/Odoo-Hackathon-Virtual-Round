import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function recordFailedAttempt(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true },
  });

  if (!user) return;

  const newAttempts = user.failedLoginAttempts + 1;
  const shouldLock = newAttempts >= MAX_FAILED_ATTEMPTS;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: newAttempts,
      lockedUntil: shouldLock ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000) : null,
    },
  });
}

export async function clearFailedAttempts(email: string): Promise<void> {
  await prisma.user.update({
    where: { email },
    data: {
      failedLoginAttempts: 0,
      lockedUntil: null,
    },
  });
}

export async function checkLockout(email: string): Promise<{ locked: boolean; lockedUntil: Date | null }> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { failedLoginAttempts: true, lockedUntil: true },
  });

  if (!user) return { locked: false, lockedUntil: null };

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    return { locked: true, lockedUntil: user.lockedUntil };
  }

  // Lock expired, clear it
  if (user.lockedUntil && user.lockedUntil <= new Date()) {
    await prisma.user.update({
      where: { email },
      data: { lockedUntil: null, failedLoginAttempts: 0 },
    });
  }

  return { locked: false, lockedUntil: null };
}