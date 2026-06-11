import { createContext, useContext } from "react";
import type { DemoSessionState, DemoUser } from "./demo-identities";

export interface DemoSessionContextValue {
  session: DemoSessionState;
  currentUser: DemoUser;
  availableTenants: string[];
  sharedPersistenceConfigured: boolean;
  switchUser: (userId: string) => void;
  switchTenant: (tenant: string) => void;
  resetSession: () => void;
}

export const DemoSessionContext = createContext<DemoSessionContextValue | null>(null);

export function useDemoSession() {
  const context = useContext(DemoSessionContext);
  if (!context) {
    throw new Error("useDemoSession must be used within DemoSessionProvider.");
  }
  return context;
}
