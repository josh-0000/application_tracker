import { createContext, useEffect, useState } from "react";
import { Application, ContextProviderProps } from "../interfaces/Interfaces";
import { useAuth0 } from "@auth0/auth0-react";

const defaultContextValues = {
  showInputModal: false,
  setShowInputModal: (_value: boolean) => {
    console.error("setShowInputModal function not yet implemented");
  },
  fetchApplications: (_userId: any) => {
    console.error("fetchApplications function not yet implemented");
  },
  applications: [] as Application[],
  showConfirmationModal: false,
  setShowConfirmationModal: (_value: boolean) => {
    console.error("setShowConfirmationModal function not yet implemented");
  },
};

export const AppContext = createContext(defaultContextValues);

export function AppContextProvider({ children }: ContextProviderProps): JSX.Element {
  const [showInputModal, setShowInputModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [applications, setApplications] = useState([] as Application[]);
  const { user } = useAuth0();
  
  const fetchApplications = async (userId: string) => {
    try {
      const response = await fetch('http://localhost:3001/applications/fetchApplications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
  
      const responseData = await response.json();
      if (response.ok) {
        console.log('Data fetched:', responseData);
        setApplications(responseData);
      } else {
        throw new Error(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchApplications(user.sub || '');
    } else {
      setApplications([] as Application[]);
    }
  }, [user]);

  useEffect(() => {
    console.log('applications:', applications);
  }, [applications]);

  const contextData = {
    showInputModal,
    setShowInputModal,
    fetchApplications,
    applications,
    showConfirmationModal,
    setShowConfirmationModal,
  };

  return (
    <AppContext.Provider value={contextData}>
      {children}
    </AppContext.Provider>
  );
}
