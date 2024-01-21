import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  if (!user) {
    return <div>user not found</div>;
  }

  if (!isAuthenticated) {
    return <div>user not authenticated</div>;
  }

  const getAccessToken = async () => {
    try {
      const accessToken = await getAccessTokenSilently();
      console.log("Access Token:", accessToken);
    } catch (e) {
      console.error(e);
    }
  };
  
  return (
    <div>
      <img src={user.picture} alt={user.name} />
      <h2>{user.name}</h2>
      <p>{user.email}</p>
      <button onClick={getAccessToken}>Get Access Token</button>
    </div>
  );
};

export default Profile;