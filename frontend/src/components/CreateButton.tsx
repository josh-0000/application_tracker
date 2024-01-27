import React from "react";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const CreateButton = () => {
  const { setShowModal } = useContext(AppContext);
  
  return (
    <Button className="pt-1 pb-1 mt-5" variant="primary" onClick={() => setShowModal(true)}>
      Create
    </Button>
  );
};

export default CreateButton;