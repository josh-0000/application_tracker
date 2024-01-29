import React, { useContext } from "react";
import { Container, Row, Col } from "react-bootstrap";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import InputModal from "./InputModal";
import ApplicationTable from "./ApplicationTable";

function MainContainer() {

  function handleSearch(searchTerm: string) {
    console.log(searchTerm);
  }

  return (
    <Container className="ms-auto me-auto contentContainer">
      <InputModal />
      <Row className="mb-3 m-0 p-0">
        <Col className="d-flex justify-content-between align-items-center">
          <div style={{ flex: 1, marginRight: '10px' }}>
            <SearchBar onSearch={handleSearch} />
          </div>
          <div>
            <CreateButton />
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