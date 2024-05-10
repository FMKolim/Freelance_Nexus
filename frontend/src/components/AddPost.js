import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Addpost.css';

function AddPost() {
  const [tags, setTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pay, setPay] = useState('');
  //State variables

  useEffect(() => {

    const fetchTags = async () => {

      try {
        
        const response = await axios.get('http://127.0.0.1:8000/api/all-tags/');
        
        setTags(response.data);
      
      } catch (error) {
      
        console.error('Error fetching tags:', error);
      
      }
    
    };

    fetchTags();
  
  }, []);
  //Fetches all saved tags from the server

  const handleTagChange = (e) => {
  
    setSelectedTag(e.target.value);
  
  };
  //Handles the tag change 

  const handleTagSelection = () => {
  
    if (selectedTag) {
  
      const tag = tags.find(tag => tag.id === parseInt(selectedTag));
  
      if (!selectedTags.find(selected => selected.id === tag.id)) {
  
        setSelectedTags([...selectedTags, tag]);
  
        setSelectedTag('');
  
      }
  
    }
  
  };

  //Handles the selection of tags from the dropdown list

  const handleRemoveTag = (tagId) => {

    setSelectedTags(selectedTags.filter(tag => tag.id !== tagId));

  };

  //Removes tags

  const handlePostAd = async () => {

    try {
      
      const token = localStorage.getItem('AuthenticationToken');

      if (!token) {

        return;

      }

      //Checks for token

      if (!title || !description || !pay) {

        alert('No fields can be left empty!');

        return;

      }
      //Checks if all fields are filled
  
      const accessToken = JSON.parse(token).access;
  
      const response = await axios.post('http://127.0.0.1:8000/api/create-advert/', {
        AdTitle: title,
        AdDesc: description,
        AdPay: pay,
        AdTags: selectedTags.map(tag => tag.id)
      
      }, {
      
        headers: {
      
          'Authorization': `Bearer ${accessToken}`
      
        }
      
      });
      //Send a request with the inputted information and token in header
  
      setTitle('');
      
      setDescription('');
      
      setPay('');
      
      setSelectedTags([]);
      //Sets the fields back to empty
    
    } catch (error) {
    
      console.error('Error posting advertisement:', error);
    
    }
  
  };
  
  

  return (
    <div>
  
      <div className='AddPostBox'>
  
        <div className='Adtitle'>
  
          <input type='text' placeholder='Title...' value={title} onChange={(e) => setTitle(e.target.value)} />
  
        </div>
  
        <div className='Addesc'>

          <textarea placeholder='Enter description....' value={description} onChange={(e) => setDescription(e.target.value)} />
  
        </div>
  
        <div className='Adpay'>
  
          <input type='number' placeholder='Pay...' id='adpay_input' min='0' max='9999999999.99' step='0.01' value={pay} onChange={(e) => setPay(e.target.value)} />
  
        </div>
  
        <div className='Adtags'>

          <select value={selectedTag} onChange={handleTagChange}>

            <option value=''>Select a tag...</option>

            {tags.map(tag => (

              <option key={tag.id} value={tag.id}>{tag.TagName}</option>

            ))}

          </select>

          <button onClick={handleTagSelection}>Add Tag</button>

        </div>

        <div className='SelectedTags'>

          <h3>Selected Tags:</h3>

          <ul>

            {selectedTags.map(tag => (

              <li key={tag.id}>

                {tag.TagName}

                <button className = 'delete-button' onClick={() => handleRemoveTag(tag.id)}>Remove</button>

              </li>

            ))}

          </ul>

        </div>

        <div className='submitbutton'>

          <button onClick={handlePostAd}>Post</button>

        </div>

      </div>

    </div>

  );

  //JSX for rendering the components and linking their functions with code 

}

export default AddPost;
