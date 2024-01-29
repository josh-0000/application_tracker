import React, { useContext } from "react";
import { Table, Form } from "react-bootstrap";
import { AppContext } from "../context/AppContext";

function ApplicationTable() {
  const { applications } = useContext(AppContext);

  return (
    <Table striped bordered hover className="mx-auto rounded-1">
      <thead>
        <tr>
          <th>
            <Form.Check type="checkbox" />
          </th>
          <th>Company</th>
          <th>Job Title</th>
          <th>Location</th>
          <th>Work Location</th>
          <th>Progress</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {applications.map((application, index) => (
          <tr key={index}>
            <td className="align-middle">
              <Form.Check type="checkbox" />
            </td>
            <td className="align-middle">{application.company}</td>
            <td className="align-middle">{application.jobTitle}</td>
            <td className="align-middle">{application.location}</td>
            <td className="align-middle">{application.workLocation}</td>
            <td className="align-middle"> 
              <Form.Control 
                as="select" 
                value={application.progress}
                className="p-1"
              >
                <option>Just Applied</option>
                <option>Rejected</option>
                <option>Interview</option>
                <option>Offer</option>
              </Form.Control>
            </td>
            <td className="align-middle">01/24/2001</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ApplicationTable;