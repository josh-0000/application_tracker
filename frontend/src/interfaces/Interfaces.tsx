export interface ContextProviderProps {
  children: React.ReactNode;
}

export interface Application {
  UserId: string;
  ApplicationId: string;
  company: string;
  jobTitle: string;
  location: string;
  workLocation: string;
  progress: string;
  date: string;
}