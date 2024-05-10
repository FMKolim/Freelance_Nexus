import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import './Profile.css';
import Calendar from 'react-calendar';
import { useHistory } from "react-router-dom";
import contextAuthentication from '../context/contextAuth';
//Import necessary files and libraries

function Profile() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [userBio, setUserBio] = useState('');
    const [editMode, setEditMode] = useState(false);
    const [userAds, setUserAds] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [calendarDate, setCalendarDate] = useState(new Date());
    const [newDeadlineStartDate, setNewDeadlineStartDate] = useState(new Date());
    const [newDeadlineEndDate, setNewDeadlineEndDate] = useState(new Date());
    const [showNewDeadlineModal, setShowNewDeadlineModal] = useState(false);
    const [newDeadlineTitle, setNewDeadlineTitle] = useState('');
    const [userDeadlines, setUserDeadlines] = useState([]);
    const [newAdTitle, setNewAdTitle] = useState('');
    const [newAdDesc, setNewAdDesc] = useState('');
    const [newAdPay, setNewAdPay] = useState('');
    const [allDeadlines, setAllDeadlines] = useState([]);
    const [dueSoon, setDueSoon] = useState(null);
    const [dueLast, setDueLast] = useState(null);
    const token = localStorage.getItem("AuthenticationToken");
    const { user, logout } = useContext(contextAuthentication);
    //All state variables are initialised ranging from deadlines to user information etc.

    useEffect(() => {
        //If token exists then decode the token and set user fields with decoded information, else throw error
        const fetchProfileData = async () => {
            try {
                if (token) {
                    const parsedToken = JSON.parse(token);
                    const accessToken = parsedToken.access;
                    const dec = jwtDecode(accessToken);
                    setUsername(dec.name);
                    setEmail(dec.email);
                    setUserBio(dec.bio)
                    
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        
        fetchAdverts();
        fetchProfileData();
        fetchAllDeadlines();
    }, [token]);

    function formatDT(dateString) {
        const formatting = {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        };
        //Formatting of data shown on adverts
    
        return new Date(dateString).toLocaleString('en-GB', formatting);
    }

    const handleEditAd = (adId) => {
        setSelectedAdId(adId); // Set the ID of the selected ad to edit
        setShowEditModal(true); // Show the edit modal
    };

    const handleCloseModal = () => {
        setShowEditModal(false); // Close the edit modal
    };

    const handleSaveEdit = async (e) => {
        e.preventDefault(); // Prevent the form from submitting and refreshing the page

        if (!newAdTitle || !newAdDesc || !newAdPay) {
            alert("Please fill in all fields!");
            return;
        }

        if (newAdPay > 99999999999.99) {

            alert("Ad pay exceeds the systems limits, please enter a lower value!")
            return;
            //If the pay inputted is above the limit set in backend throw an error
        }
    
        try {
            // Prepare the data to be sent in the request body
            const updatedAdData = {
                AdTitle: newAdTitle,
                AdDesc: newAdDesc,
                AdPay: newAdPay,
            };
    
            // Retrieve the access token from localStorage
            const token = localStorage.getItem("AuthenticationToken");
    
            if (!token) {
                return;
            }
    
            const accessToken = JSON.parse(token).access;
    
            // Make a PUT request to the update_advert endpoint with the ad ID and updated data
            const response = await axios.put(`http://127.0.0.1:8000/api/update-advert/${selectedAdId}/`, updatedAdData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
    
    
            // Refresh the user ads after editing
            fetchAdverts();
            handleCloseModal(); // Close the modal after saving
        } catch (error) {
            console.error('Error editing advert:', error);
        }
    };
    

    const fetchAdverts = async () => {
        try {
            //gets all the adverts in the system and filters them out to show only ones made by logged in user
            const parsedToken = JSON.parse(token);
            const accessToken = parsedToken.access;
            const dec = jwtDecode(accessToken);
            const response = await axios.get('http://127.0.0.1:8000/api/all-ads/', {
                headers: {
                  'Authorization': `Bearer ${accessToken}`
                }
              });
            const ads = response.data.filter(ad => ad.AdOwner === dec.name);
            setUserAds(ads);
        } catch (error) {
          console.error('Error fetching adverts:', error);
        }
    };

    const handleSave = async () => {
        try {

            if (!username.trim()) {
                alert("Please enter a username!");
                return;
            }
            
            // Prepare the data to be sent in the request body
            const updatedProfile = {
                name: username,
                email: email,
                bio: userBio,
            };

    
            const token = localStorage.getItem("AuthenticationToken");

            if (!token) {
                return;
            }
            //If token doesnt exist then do nothing
            const accessToken = JSON.parse(token).access;
    
            const response = await axios.put('http://127.0.0.1:8000/api/update-profile/', updatedProfile, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });

            setEditMode(false); 
            logout();
            //Once changed log the user out and redirect to home page
            
        } catch (error) {
            console.error('Error updating profile:', error);
        }
    };

    const handleDeleteAd = async (adId) => {
        try {
            const token = localStorage.getItem("AuthenticationToken");

            if (!token) {
                return;
            }

            const accessToken = JSON.parse(token).access;

            await axios.delete(`http://127.0.0.1:8000/api/delete/${adId}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            //Deletes the advert from database 

            fetchAdverts();
        } catch (error) {
            console.error('Error deleting advert:', error);
        }
    };

    const handleEdit = (adId) => {
        setEditMode(true);
    };

    const handleCloseNewDeadlineModal = () => {
        setShowNewDeadlineModal(false);
    };

    const handleCalendarChange = (date) => {
        setCalendarDate(date);
    };

    const handleNewDeadlineDateChange = (date) => {
        setNewDeadlineStartDate(date);
        setNewDeadlineEndDate(date);
    };

    const handleNewDeadlineSubmit = async (e) => {
        e.preventDefault();

        if(!newDeadlineTitle.trim()) {

            alert("Please enter a deadline title!");
            return;

        }

        try {
            // Fetch the users id
            const token = localStorage.getItem("AuthenticationToken");
            if (!token) {
                return;
            }
            const accessToken = JSON.parse(token).access;
            const dec = jwtDecode(accessToken);
            const userId = dec.user_id;
    
            // Make a new object with all inputted information
            const newDeadlineData = {
                ProjectTitle: newDeadlineTitle,
                StartDate: newDeadlineStartDate.toISOString().split('T')[0],
                EndDate: newDeadlineEndDate.toISOString().split('T')[0],
                ProjectOwner: userId
            };
    
            //send a request to the server with information in body and token in header
            const response = await axios.post('http://127.0.0.1:8000/api/add-deadline/', newDeadlineData, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
    
            setUserDeadlines([...userDeadlines, response.data]);
            setAllDeadlines([...allDeadlines, response.data]);
    
            if (!dueSoon || new Date(response.data.EndDate) < new Date(dueSoon.EndDate)) {
                setDueSoon(response.data);
            }
            if (!dueLast || new Date(response.data.EndDate) > new Date(dueLast.EndDate)) {
                setDueLast(response.data);
            }
    
            handleCloseNewDeadlineModal();
            //Close modal once deadline made
        } catch (error) {
            console.error('Error adding new deadline:', error);
        }
    };

    const fetchAllDeadlines = async () => {
        //In charge of fetching all deadlines and filtering them for the user logged in
        try {
            const token = localStorage.getItem("AuthenticationToken");

            if (!token) {
                return;
            }

            const accessToken = JSON.parse(token).access;
            const dec = jwtDecode(accessToken);
            const userId = dec.user_id;
            //Decodes the token if available

            const response = await axios.get('http://127.0.0.1:8000/api/all-deadlines/', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const userDeadlines = response.data.filter(deadline => deadline.ProjectOwner === userId);

            if (userDeadlines.length === 0) {
                setAllDeadlines([]);
                return;
            }
            //If no deadlines found associated to user then keep list empty

            const sortedDeadlines = userDeadlines.sort((a, b) => {
                const dateA = new Date(a.EndDate);
                const dateB = new Date(b.EndDate);
                return dateA - dateB;
            });
            //Find the date difference between the start and end dates for deadline

            setAllDeadlines(sortedDeadlines);
            setDueSoon(sortedDeadlines[0]);
            setDueLast(sortedDeadlines[sortedDeadlines.length - 1]);
        } catch (error) {
            console.error('Error fetching deadlines:', error);
        }
    };

    const handleDeleteDeadline = async (deadlineId) => {
        try {
            const token = localStorage.getItem("AuthenticationToken");
            if (!token) {
                return;
            }
            const accessToken = JSON.parse(token).access;
            const response = await axios.delete(`http://127.0.0.1:8000/api/delete-deadline/${deadlineId}/`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            //After sending a delete request if user is logged in a request is sent to backend to delete
    
            const updatedUserDeadlines = userDeadlines.filter(deadline => deadline.id !== deadlineId);
            const updatedAllDeadlines = allDeadlines.filter(deadline => deadline.id !== deadlineId);
            //Filter out id of delete advert 
    
            if (dueSoon && dueSoon.id === deadlineId) {
                const newDueSoon = updatedAllDeadlines.length > 0 ? updatedAllDeadlines[0] : null;
                setDueSoon(newDueSoon);
            }
            if (dueLast && dueLast.id === deadlineId) {
                const newDueLast = updatedAllDeadlines.length > 0 ? updatedAllDeadlines[updatedAllDeadlines.length - 1] : null;
                setDueLast(newDueLast);
            }
            //Changes the variables that hold due soon and due last projects after the deletion of advert, if none found then set to null
    
            setUserDeadlines(updatedUserDeadlines);
            setAllDeadlines(updatedAllDeadlines);
        } catch (error) {
            console.error('Error deleting deadline:', error);
        }
    };

    return (
        <div className='profile-wrapper'>
            <div className='UserInfo'>
                <div className='profile-header'>
                    <h1> Profile </h1>
                </div>

                <div className='profile-info'>
                    Username: {!editMode ? username : (
                        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)}/>
                    )}
                    {!editMode && <button className="edit-button" onClick={handleEdit}>Edit</button>}
                    {editMode && <button className="save-button" onClick={handleSave}>Save</button>}
                </div>

                <div className='profile-info'>
                    Email: {email}
                </div>

                <div className='profile-info'>
                    Bio: {!editMode ? userBio : (
                        <input type="text" value={userBio} onChange={(e) => setUserBio(e.target.value)}/>
                    )}
                    {!editMode && <button className="edit-button" onClick={handleEdit}>Edit</button>}
                    {editMode && <button className="save-button" onClick={handleSave}>Save</button>}
                </div>
            </div>

            {/* Calendar component */}
            <div className='calendar-container'>
                <Calendar onChange={handleCalendarChange} value={calendarDate}/>
                <button className="add-deadline-btn" onClick={() => setShowNewDeadlineModal(true)}>Add Deadline</button>
            </div>

            {/* Deadlines tab showing all deadlines */}
            <div className="deadlines-list">

                <h2>User Deadlines:</h2>

                <div className="deadlines-container">

                    <br />

                    {allDeadlines.map(deadline => (

                        <div className="deadline-box" key={deadline.id}>
                            <br />

                            <h3>{deadline.ProjectTitle}</h3>

                            <p><strong>Start Date:</strong> {deadline.StartDate}</p>

                            <p><strong>End Date:</strong> {deadline.EndDate}</p>
                            
                            <button className="delete-button" onClick={() => handleDeleteDeadline(deadline.id)}>Delete</button>
                        </div>
                    ))}

                    <br/>

                    {dueSoon && (
                        <p><strong>Due Soon: {dueSoon.ProjectTitle}</strong></p>
                    )}
                    {dueLast && (
                        <p><strong>Due Last: {dueLast.ProjectTitle}</strong></p>
                    )}
                </div>
            </div>

            {/* Deadline Modals */}

            {showNewDeadlineModal && (
                <div className="modal">
                    <div className="modal-content">

                        <span className="close" onClick={handleCloseNewDeadlineModal}>&times;</span>

                        <h2>Add New Deadline</h2>

                        <form onSubmit={handleNewDeadlineSubmit}>

                            <input type="text" placeholder="Project Title" value={newDeadlineTitle} onChange={(e) => setNewDeadlineTitle(e.target.value)}/>
                            
                            <label>Start Date:</label>

                            <input type="date" value={newDeadlineStartDate.toISOString().split('T')[0]} onChange={(e) => handleNewDeadlineDateChange(new Date(e.target.value))}/>
                            
                            <label>End Date:</label>

                            
                            <input type="date" value={newDeadlineEndDate.toISOString().split('T')[0]} onChange={(e) => setNewDeadlineEndDate(new Date(e.target.value))}/>
                            
                            <button type="submit">Add Deadline</button>
                        
                        </form>

                    </div>
                </div>
            )}

            {/* Edit advertisement modal */}

            {showEditModal && (
                <div className="edit-modal-overlay">
                    <div className="edit-modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Edit Advertisement</h2>
                        <form onSubmit={handleSaveEdit}>
                            {/* Input fields for editing advertisement data */}
                            {/* Use state variables to capture updated values */}
                            <input type="text" placeholder="New Title" value={newAdTitle} onChange={(e) => setNewAdTitle(e.target.value)}/>

                            <input type="text" placeholder="New Description" value={newAdDesc} onChange={(e) => setNewAdDesc(e.target.value)}/>

                            <input type="number" placeholder="New Pay" value={newAdPay} onChange={(e) => setNewAdPay(e.target.value)}/>

                            <button type="submit">Save Changes</button>
                        </form>
                    </div>
                </div>
            )}

            {/* All user posted adverts are shown here */}
            <div className="ads-list">
                <h2>User Adverts:</h2>
                <div className="ads-container">
                    {userAds.map(ad => (
                        <div className="ad-box" key={ad.id}>
                            <h3>{ad.AdTitle}</h3>
                            <p>{ad.AdDesc}</p>
                            <p>Pay: {ad.AdPay}</p>
                            <p>Date: {formatDT(ad.AdDate)}</p>
                            <button className="delete-button" onClick={() => handleDeleteAd(ad.id)}>Delete</button>
                            <button className="edit-button" onClick={() => handleEditAd(ad.id)}>Edit</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

}
export default Profile;
