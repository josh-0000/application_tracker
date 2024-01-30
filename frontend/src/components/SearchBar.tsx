import React, { useState } from 'react';
import { Form, FormControl } from 'react-bootstrap';

function SearchBar({ onSearch }: any) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormControl
        type="text"
        placeholder="Filter"
        className="searchBar mt-5"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </Form>
  );
};

export default SearchBar;
