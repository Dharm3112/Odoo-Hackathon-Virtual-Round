export interface PasswordStrength {
  score: number; // 0-4
  label: string;
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  const labels = ["Very Weak", "Weak", "Fair", "Strong", "Very Strong"];
  
  return {
    score: Math.min(score, 4),
    label: labels[score],
  };
}

export function getStrengthColor(score: number): string {
  if (score <= 1) return "bg-red-500";
  if (score === 2) return "bg-yellow-500";
  if (score === 3) return "bg-blue-500";
  return "bg-green-500";
}