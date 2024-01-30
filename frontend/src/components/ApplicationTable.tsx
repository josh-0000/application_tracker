import React, { useContext, useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';

function ApplicationTable() {
  const { applications, allChecked, handleAllCheck, checked, handleCheck } = useContext(AppContext);

  if (applications.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>No applications found</h3>
      </div>
    );
  }

  return (
    <Table striped bordered hover className="mx-auto rounded-1">
      <thead>
        <tr>
          <th>
            <Form.Check 
              type="checkbox"
              checked={allChecked}
              onChange={handleAllCheck}
            />
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
              <Form.Check 
                type="checkbox" 
                checked={checked[index]}
                onChange={() => handleCheck(index)}
              />
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
            <td className="align-middle">1994</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

export default ApplicationTable;
