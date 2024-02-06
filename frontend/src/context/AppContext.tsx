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
  allChecked: false,
  handleAllCheck: (_e: any) => {
    console.error("handleAllCheck function not yet implemented");
  },
  checked: [] as boolean[],
  handleCheck: (_index: any) => {
    console.error("handleCheck function not yet implemented");
  },
  getCheckedApplicationIds: (): string[] => {
    console.error("getCheckedApplicationIds function not yet implemented");
    return [];
  },
  searchTerm: '',
  setSearchTerm: (_value: string) => {
    console.error("setSearchTerm function not yet implemented");
  },
};

export const AppContext = createContext(defaultContextValues);

export function AppContextProvider({ children }: ContextProviderProps): JSX.Element {
  const [showInputModal, setShowInputModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [applications, setApplications] = useState([] as Application[]);
  const { user } = useAuth0();
  const [checked, setChecked] = useState(new Array(applications.length).fill(false));
  const [searchTerm, setSearchTerm] = useState('');
  
  // Update the `checked` array if the number of applications changes
  useEffect(() => {
    setChecked(new Array(applications.length).fill(false));
  }, [applications]);

  // Set all checkboxes to the same value
  const handleAllCheck = (e: any) => {
    setChecked(new Array(applications.length).fill(e.target.checked));
  };

  // Update the `checked` array when a checkbox is clicked
  const handleCheck = (index: any) => {
    const updatedChecked = [...checked];
    updatedChecked[index] = !updatedChecked[index];
    setChecked(updatedChecked);
  };

  // Determine whether all checkboxes are checked
  const allChecked = checked.every(Boolean);

  // Return an array of checked application ids
  const getCheckedApplicationIds = (): string[] => {
    return applications
      .filter((_, index) => checked[index])
      .map((application) => application.ApplicationId);
  };

  function sortApplicationsByDate(applications: Application[]) {
    return applications.sort((a: any, b: any) => a.date - b.date);
  }

  function formatApplicationDates(applications: Application[]) {
    return applications.map(application => ({
      ...application,
      date: new Date(application.date).toLocaleDateString('en-US', {
        year: '2-digit', month: '2-digit', day: '2-digit'
      })
    }));
  }
  
  
  const fetchApplications = async (userId: string) => {
    try {
      if (!process.env.REACT_APP_FETCH_APPLICATIONS_URL) {
        throw new Error('REACT_APP_FETCH_APPLICATIONS_URL is undefined');
      }
      const response = await fetch(process.env.REACT_APP_FETCH_APPLICATIONS_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
  
      const responseData = await response.json();
      if (response.ok) {
        setApplications(formatApplicationDates(sortApplicationsByDate(responseData)));
      } else {
        throw new Error(`Error: ${responseData.error}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Fetch applications when the user logs in
  useEffect(() => {
    if (user) {
      fetchApplications(user.sub || '');
    } else {
      setApplications([] as Application[]);
    }
  }, [user]);

  const contextData = {
    showInputModal,
    setShowInputModal,
    fetchApplications,
    applications,
    showConfirmationModal,
    setShowConfirmationModal,
    allChecked,
    handleAllCheck,
    checked,
    handleCheck,
    getCheckedApplicationIds,
    searchTerm,
    setSearchTerm,
  };

  return (
    <AppContext.Provider value={contextData}>
      {children}
    </AppContext.Provider>
  );
}
