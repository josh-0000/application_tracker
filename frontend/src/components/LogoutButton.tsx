import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <Button className="pt-1 pb-1" variant="primary" onClick={() => logout({ logoutParams: { returnTo: "http://localhost:3000" } })}>
      Log out
    </Button>
  );
};

export default LogoutButton;