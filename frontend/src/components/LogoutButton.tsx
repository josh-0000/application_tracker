import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function LogoutButton() {
  const { logout } = useAuth0();

  const redirect_uri = process.env.REACT_APP_REDIRECT_URL || 'undefined';
  return (
    <Button className="pt-1 pb-1" variant="dark" onClick={() => logout({ logoutParams: { returnTo: redirect_uri } })}>
      Log out
    </Button>
  );
};

export default LogoutButton;