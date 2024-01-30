import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import InputModal from "./InputModal";
import ApplicationTable from "./ApplicationTable";
import RemoveButton from "./DeleteButton";
import ConfirmationModal from "./ConfirmationModal";

function MainContainer() {

  function handleSearch(searchTerm: string) {
    console.log(searchTerm);
  }

  return (
    <Container className="ms-auto me-auto contentContainer">
      <InputModal />
      <ConfirmationModal />
      <Row className="mb-3 m-0 p-0">
        <Col className="d-flex justify-content-between align-items-center">
          <div style={{marginRight: '10px' }}>
            <CreateButton />
          </div>
          <div>
            <RemoveButton />
          </div>
          <div style={{ flex: 1, marginLeft: '10px' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
        </Col>
      </Row>
      <Row className="m-0 p-0">
        <Col className="mt-5 m-0 p-0">
          <ApplicationTable />
        </Col>
      </Row>
    </Container>
  );
}

export default MainContainer;