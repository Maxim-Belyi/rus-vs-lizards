import { createContext, useContext, useRef } from "react";
import type { ReactNode } from "react";

type CardRefEntry = { current: HTMLButtonElement | null };
type CardRefsMap = Map<string, CardRefEntry>;

interface CardRefsContextType {
  registerCardRef: (id: string, ref: CardRefEntry) => void;
  unregisterCardRef: (id: string) => void;
  getCardRef: (id: string) => CardRefEntry | undefined;
}

export const CardRefsContext = createContext<CardRefsContextType>({
  registerCardRef: () => {},
  unregisterCardRef: () => {},
  getCardRef: () => undefined,
});

export function CardRefsProvider({ children }: { children: ReactNode }) {
  const cardRefsMapRef = useRef<CardRefsMap>(new Map());

  const registerCardRef = (id: string, ref: CardRefEntry) => {
    cardRefsMapRef.current.set(id, ref);
  };

  const unregisterCardRef = (id: string) => {
    cardRefsMapRef.current.delete(id);
  };

  const getCardRef = (id: string) => {
    return cardRefsMapRef.current.get(id);
  };

  return (
    <CardRefsContext.Provider
      value={{ registerCardRef, unregisterCardRef, getCardRef }}
    >
      {children}
    </CardRefsContext.Provider>
  );
}

export const useCardRefs = () => useContext(CardRefsContext);
