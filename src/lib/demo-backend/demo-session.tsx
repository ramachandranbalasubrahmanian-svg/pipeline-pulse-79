import { useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_DEMO_SESSION,
  DEMO_USERS,
  type DemoSessionState,
  type DemoUser,
} from "./demo-identities";
import { DemoSessionContext } from "./demo-session-context";
import { isSupabaseConfigured } from "./supabase";

const STORAGE_KEY = "pipelinePulse.demoSession";

function getUserById(userId: string) {
  return DEMO_USERS.find((user) => user.id === userId) ?? DEMO_USERS[0];
}

function sanitizeSession(session: DemoSessionState): DemoSessionState {
  const currentUser = getUserById(session.userId);
  const tenant = currentUser.tenants.includes(session.tenant)
    ? session.tenant
    : currentUser.tenants[0];
  return {
    userId: currentUser.id,
    tenant,
  };
}

function readDemoSession() {
  if (typeof window === "undefined") return DEFAULT_DEMO_SESSION;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_DEMO_SESSION;
  try {
    return sanitizeSession(JSON.parse(raw) as DemoSessionState);
  } catch {
    return DEFAULT_DEMO_SESSION;
  }
}

function writeDemoSession(session: DemoSessionState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function DemoSessionProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<DemoSessionState>(DEFAULT_DEMO_SESSION);

  useEffect(() => {
    setSession(readDemoSession());
  }, []);

  const currentUser = getUserById(session.userId);
  const availableTenants = currentUser.tenants;

  function commit(nextSession: DemoSessionState) {
    const sanitized = sanitizeSession(nextSession);
    setSession(sanitized);
    writeDemoSession(sanitized);
  }

  return (
    <DemoSessionContext.Provider
      value={{
        session,
        currentUser,
        availableTenants,
        sharedPersistenceConfigured: isSupabaseConfigured(),
        switchUser(userId) {
          const nextUser = getUserById(userId);
          commit({
            userId: nextUser.id,
            tenant: nextUser.tenants.includes(session.tenant)
              ? session.tenant
              : nextUser.tenants[0],
          });
        },
        switchTenant(tenant) {
          commit({
            ...session,
            tenant,
          });
        },
        resetSession() {
          commit(DEFAULT_DEMO_SESSION);
        },
      }}
    >
      {children}
    </DemoSessionContext.Provider>
  );
}
