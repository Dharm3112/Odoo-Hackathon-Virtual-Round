import { prisma } from "@/lib/prisma";

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MINUTES = 15;

export async function recordFailedAttempt(email: string): Promise<{ locked: boolean; attemptsRemaining: number }> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, failedLoginAttempts: true, lockedUntil: true },
  });

  if (!user) {
    return { locked: false, attemptsRemaining: MAX_FAILED_ATTEMPTS };
  }

  const newAttempts = (user.failedLoginAttempts || 0) + 1;
  const lockedUntil = newAttempts >= MAX_FAILED_ATTEMPTS
    ? new Date(Date.now() + LOCKOUT_DURATION_MINUTES * 60 * 1000)
    : null;

  await prisma.user.update({
    where: { id: user.id },
    data: {
      failedLoginAttempts: newAttempts,
      lockedUntil,
    },
  });

  return {
    locked: newAttempts >= MAX_FAILED_ATTEMPTS,
    attemptsRemaining: Math.max(0, MAX_FAILED_ATTEMPTS - newAttempts),
  };
}

export async function clearFailedAttempts(email: string): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (user) {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }
}

export async function checkLockout(email: string): Promise<{ locked: boolean; lockedUntil: Date | null }> {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { lockedUntil: true },
  });

  if (!user || !user.lockedUntil) {
    return { locked: false, lockedUntil: null };
  }

  const now = new Date();
  if (user.lockedUntil > now) {
    return { locked: true, lockedUntil: user.lockedUntil };
  }

  // Lock expired, clear it
  await prisma.user.update({
    where: { email },
    data: { lockedUntil: null, failedLoginAttempts: 0 },
  });

  return { locked: false, lockedUntil: null };
}

export async function isAccountLocked(email: string): Promise<boolean> {
  const { locked } = await checkLockout(email);
  return locked;
}