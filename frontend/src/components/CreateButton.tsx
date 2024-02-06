import React from "react";
import { Button } from "react-bootstrap";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function CreateButton() {
  const { setShowInputModal, applications } = useContext(AppContext);
  
  const handleCreate = () => {
    if (applications.length >= 100) {
      alert('You have reached the maximum number of applications');
      return;
    }
    setShowInputModal(true);
  };

  return (
    <Button className="pt-1 pb-1 mt-5" variant="primary" onClick={() => handleCreate()}>
      Create
    </Button>
  );
};

export default CreateButton;