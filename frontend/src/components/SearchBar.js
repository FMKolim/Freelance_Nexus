import React, {useState} from 'react';
import './SearchBar.css';
import { FaSearch } from "react-icons/fa";

export const SearchBar = ({ setResults }) => {

  const [SearchInput, setSearchInput] = useState("");
  //Initialise all state variables

  const fetchAdverts = (value) => {

    fetch('http://127.0.0.1:8000/api/all-ads/').then((response) => response.json()).then((json) => {
      const result = json.filter((advert) => {
        return value && advert && advert.AdTitle && advert.AdTitle.toLowerCase().includes(value);
        //Calling API to have a list of all adverts of system and after inputting character, will start filtering out the searches
      });
      setResults(result);
      //If nothing is inputted then nothing is displayed and no searches are made 
    });

  };

  const HandleInputChange = (value) => {
    //Updates the input state and fetches adverts based on the new characters
    setSearchInput(value);
    fetchAdverts(value);

  }

  return (
    <div className='searchbar-container'>

      <div className='input-field'>

        <input placeholder='Search...' value={SearchInput} onChange={(e) => HandleInputChange(e.target.value)}/>
        {/* For every character inputted call the handleinputchange function  */}
        <FaSearch id='FaSearch' />

      </div>
      
    </div>
  
  )
  
}

export default SearchBar