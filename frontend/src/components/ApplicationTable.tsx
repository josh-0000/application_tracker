import React, { useContext, useState, useEffect } from 'react';
import { Table, Form, Dropdown } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';
import { useAuth0 } from '@auth0/auth0-react';

function ApplicationTable() {
  const { searchTerm, applications, allChecked, handleAllCheck, checked, handleCheck, fetchApplications } = useContext(AppContext);
  const { user } = useAuth0();
  const [displayedApplications, setDisplayedApplications] = useState(applications);

  useEffect(() => {
    const filteredApplications = searchTerm
      ? applications.filter(app => 
          Object.values(app).some(
            attr => typeof attr === 'string' && attr.toLowerCase().includes(searchTerm.toLowerCase())
          )
        )
      : applications;

    setDisplayedApplications(filteredApplications);
  }, [searchTerm, applications]);

  if (displayedApplications.length === 0) {
    return (
      <div className="text-center mt-5">
        <h3>No applications found</h3>
      </div>
    );
  }

  const handleProgressChange = async (e: any, applicationId: string) => {
    const newProgress = e.target.value;
    console.log(newProgress, applicationId);
    
    if (!user) {
      throw new Error('User is undefined!');
    }
    
    try {
      const response = await fetch('http://localhost:3001/applications/updateProgress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.sub,
          applicationId: applicationId,
          progress: newProgress,
        }),
      });
  
      const responseData = await response.json();
  
      if (response.ok) {
        fetchApplications(user.sub);
      } else {
        console.error('Failed to update progress:', responseData.error);
      }
    } catch (error) {
      console.error('Failed to update progress:', error);
    }
  };

  const numApplications = displayedApplications.length;

  return (
    <div className='position-relative'>
      <div className="position-relative shadow-sm mx-auto applicationTableContainer" style={{ maxWidth: '100%' }}>
        <Table striped bordered hover className="rounded-1 applicationTable m-0">
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
            {displayedApplications.map((application, index) => (
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
                    className="p-1 m-0 border-1 bg-light rounded-1 cursorPointer"
                    onChange={(e) => handleProgressChange(e, application.ApplicationId)}
                  >
                    <option className='cursorPointer'>Waiting</option>
                    <option className='cursorPointer'>Rejected</option>
                    <option className='cursorPointer'>Interview</option>
                    <option className='cursorPointer'>Offer</option>
                  </Form.Control>
                </td>
                <td className="align-middle">{application.date}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
      <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-primary shadow text-light">
        {numApplications}
      </span>
    </div>
  );
}

export default ApplicationTable;
