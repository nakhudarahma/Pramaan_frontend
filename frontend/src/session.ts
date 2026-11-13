export type SessionRole = "student" | "admin";

export interface Session {
  role: SessionRole;
  demo: boolean;
  mock?: boolean;
  name: string;
  email?: string;
  picture?: string;
  credential?: string;
}

const SESSION_KEY = "pramaan-session";

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      (parsed.role === "student" || parsed.role === "admin") &&
      typeof parsed.name === "string"
    ) {
      return {
        role: parsed.role,
        demo: Boolean(parsed.demo),
        mock: Boolean(parsed.mock),
        name: parsed.name,
        email: typeof parsed.email === "string" ? parsed.email : undefined,
        picture: typeof parsed.picture === "string" ? parsed.picture : undefined,
        credential: typeof parsed.credential === "string" ? parsed.credential : undefined,
      };
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function setSession(session: Session): void {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(SESSION_KEY);
}
