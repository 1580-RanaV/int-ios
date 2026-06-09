"use client";

import { createContext, useContext, useState } from "react";

type NavContextType = { scrolled: boolean; setScrolled: (v: boolean) => void };

const NavContext = createContext<NavContextType>({ scrolled: false, setScrolled: () => {} });

export const useNav = () => useContext(NavContext);

export function NavProvider({ children }: { children: React.ReactNode }) {
  const [scrolled, setScrolled] = useState(false);
  return (
    <NavContext.Provider value={{ scrolled, setScrolled }}>
      {children}
    </NavContext.Provider>
  );
}
