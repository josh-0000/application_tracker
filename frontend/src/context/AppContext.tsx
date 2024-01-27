import { createContext, useState } from "react";
import { ContextProviderProps } from "../interfaces/Interfaces";

const defaultContextValues = {
  showModal: false,
  setShowModal: (_value: boolean) => {
    console.error("setShowModal function not yet implemented");
  },
};

export const AppContext = createContext(defaultContextValues);

export function AppContextProvider({ children }: ContextProviderProps): JSX.Element {
  const [showModal, setShowModal] = useState(false);

  const contextData = {
    showModal,
    setShowModal,
  };

  return (
    <AppContext.Provider value={contextData}>
      {children}
    </AppContext.Provider>
  );
}
