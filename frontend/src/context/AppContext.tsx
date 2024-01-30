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
};

export const AppContext = createContext(defaultContextValues);

export function AppContextProvider({ children }: ContextProviderProps): JSX.Element {
  const [showInputModal, setShowInputModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [applications, setApplications] = useState([] as Application[]);
  const { user } = useAuth0();
  const [checked, setChecked] = useState(new Array(applications.length).fill(false));

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

  // Log the checked array whenever it changes
  useEffect(() => {
    console.log('checked:', checked);
    console.log('getCheckedApplicationIds:', getCheckedApplicationIds());
  }
  , [checked]);
  
  // Determine whether all checkboxes are checked
  const allChecked = checked.every(Boolean);

  // Return an array of checked application ids
  const getCheckedApplicationIds = () => {
    return applications
      .filter((_, index) => checked[index])
      .map((application) => application.ApplicationId);
  };
  
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

  // Fetch applications when the user logs in
  useEffect(() => {
    if (user) {
      fetchApplications(user.sub || '');
    } else {
      setApplications([] as Application[]);
    }
  }, [user]);

  // Log the applications whenever they change
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
    allChecked,
    handleAllCheck,
    checked,
    handleCheck,
  };

  return (
    <AppContext.Provider value={contextData}>
      {children}
    </AppContext.Provider>
  );
}
