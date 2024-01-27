import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SearchBar from "./SearchBar";
import CreateButton from "./CreateButton";
import InputModal from "./InputModal";

function MainContainer() {
  function handleSearch(searchTerm: string) {
    console.log(searchTerm);
  }

  return (
    <Col className="mainContainer">
      <Container className="ms-auto me-auto contentContainer">
        <InputModal />
        <Row>
          <Col md={10}>
            <SearchBar onSearch={handleSearch} />
          </Col>
          <Col md={2}>
            <CreateButton />
          </Col>
        </Row>
      </Container>
    </Col>
  );
}

export default MainContainer;