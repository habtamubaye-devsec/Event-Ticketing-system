import { createContext, ReactNode, useContext, useMemo, useState } from "react";

type HomeSearchConfig = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  placeholder?: string;
};

type NavExtensionContextValue = {
  homeSearchConfig: HomeSearchConfig | null;
  setHomeSearchConfig: (config: HomeSearchConfig | null) => void;
};

const NavExtensionContext = createContext<NavExtensionContextValue | null>(null);

export function NavExtensionProvider({ children }: { children: ReactNode }) {
  const [homeSearchConfig, setHomeSearchConfig] = useState<HomeSearchConfig | null>(null);
  const value = useMemo(() => ({ homeSearchConfig, setHomeSearchConfig }), [homeSearchConfig]);
  return (
    <NavExtensionContext.Provider value={value}>
      {children}
    </NavExtensionContext.Provider>
  );
}

export function useNavExtension() {
  const context = useContext(NavExtensionContext);
  if (!context) {
    throw new Error("useNavExtension must be used within a NavExtensionProvider");
  }
  return context;
}
