import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function LoginButton({ className = '' , variant = ''} = {}) {
  const { loginWithRedirect } = useAuth0();

  return <Button className={className} variant={variant} onClick={() => loginWithRedirect()}>Log in</Button>;
};

export default LoginButton;