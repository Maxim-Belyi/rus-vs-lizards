import { createContext, useContext, useRef } from "react";
import type { RefObject, ReactNode } from "react";

type CardRefsMap = Map<string, RefObject<HTMLButtonElement>>;

interface CardRefsContextType {
  cardRefs: CardRefsMap;
  registerCardRef: (id: string, ref: RefObject<HTMLButtonElement>) => void;
  unregisterCardRef: (id: string) => void;
  getCardRef: (id: string) => RefObject<HTMLButtonElement> | undefined;
}

export const CardRefsContext = createContext<CardRefsContextType>({
  cardRefs: new Map(),
  registerCardRef: () => {},
  unregisterCardRef: () => {},
  getCardRef: () => undefined,
});

export function CardRefsProvider({ children }: { children: ReactNode }) {
  const cardRefsMapRef = useRef<CardRefsMap>(new Map());

  const registerCardRef = (id: string, ref: RefObject<HTMLButtonElement>) => {
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
      value={{
        cardRefs: cardRefsMapRef.current,
        registerCardRef,
        unregisterCardRef,
        getCardRef,
      }}
    >
      {children}
    </CardRefsContext.Provider>
  );
}

export const useCardRefs = () => useContext(CardRefsContext);
