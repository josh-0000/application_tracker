import { useContext } from 'react';
import { Form, FormControl } from 'react-bootstrap';
import { AppContext } from '../context/AppContext';

function SearchBar() {
  const { searchTerm, setSearchTerm } = useContext(AppContext);

  return (
    <Form>
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
