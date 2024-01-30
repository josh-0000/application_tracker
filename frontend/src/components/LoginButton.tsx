import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function LoginButton({ className = '' } = {}) {
  const { loginWithRedirect } = useAuth0();

  return <Button className={className} variant="primary" onClick={() => loginWithRedirect()}>Log in</Button>;
};

export default LoginButton;