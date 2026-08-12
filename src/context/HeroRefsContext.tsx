import { createContext, useContext, useRef } from "react";
import type { RefObject, ReactNode } from "react";
import type { TPlayer } from "../store/game.types";

type HeroRefsMap = Map<TPlayer, RefObject<HTMLDivElement>>;

interface HeroRefsContextType {
  registerHeroRef: (player: TPlayer, ref: RefObject<HTMLDivElement>) => void;
  getHeroRef: (player: TPlayer) => RefObject<HTMLDivElement> | undefined;
}

export const HeroRefsContext = createContext<HeroRefsContextType>({
  registerHeroRef: () => {},
  getHeroRef: () => undefined,
});

export function HeroRefsProvider({ children }: { children: ReactNode }) {
  const heroRefsMapRef = useRef<HeroRefsMap>(new Map());

  const registerHeroRef = (player: TPlayer, ref: RefObject<HTMLDivElement>) => {
    heroRefsMapRef.current.set(player, ref);
  };

  const getHeroRef = (player: TPlayer) => {
    return heroRefsMapRef.current.get(player);
  };

  return (
    <HeroRefsContext.Provider value={{ registerHeroRef, getHeroRef }}>
      {children}
    </HeroRefsContext.Provider>
  );
}

export const useHeroRefs = () => useContext(HeroRefsContext);
