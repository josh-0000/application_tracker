import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "react-bootstrap";

function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <Button className="pt-1 pb-1" variant="dark" onClick={() => logout({ logoutParams: { returnTo: "http://localhost:3000" } })}>
      Log out
    </Button>
  );
};

export default LogoutButton;