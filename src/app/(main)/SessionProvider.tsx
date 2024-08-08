"use client";

import { Session, User } from "lucia";
import { createContext, useContext } from "react";

interface valuesProps {
  user: User;
  session: Session;
}

const sessionContext = createContext<valuesProps | null>(null);

export default function SessionProvider({
  children,
  values,
}: React.PropsWithChildren<{ values: valuesProps }>) {
  return (
    <sessionContext.Provider value={values}>{children}</sessionContext.Provider>
  );
}

export const useSession = () => {
  const session = useContext(sessionContext);

  if (!session)
    throw new Error("useSession must be used within a SessionProvider");

  return session;
};
