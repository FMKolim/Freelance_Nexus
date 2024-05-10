import React, { useState, useEffect } from 'react';
import './home.css';
import SearchBar from './SearchBar';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';
import SearchBarList from './SearchBarList';

function Home() {
  const [adverts, setAdverts] = useState([]);
  const [modalAdBox, setModalAdBox] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('');
  const [sender, setSender] = useState('');
  const [emailContent, setEmailContent] = useState('');
  const [results, setResults] = useState([]);
  const token = localStorage.getItem("AuthenticationToken");
  //Initiate state variables

  // Initialize variables related to authentication
  let accessToken = null;
  let dec = null;

  // Check if token is available and decode it
  if (token) {
    
    const parsedToken = JSON.parse(token);
    
    accessToken = parsedToken.access;
    
    dec = jwtDecode(accessToken);
  }

  useEffect(() => {
    const fetchAdverts = async () => {

      try {

        const response = await axios.get('http://127.0.0.1:8000/api/all-ads/');

        setAdverts(response.data);

      } catch (error) {

        console.error('Error fetching adverts:', error);
        // Using an axios request get all the adverts saved in the database
      }
    };

    fetchAdverts();
  }, []);

  const handleReadMore = async (ad) => {
    setModalAdBox(ad);
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/get-comments/`);
      const filteredComments = response.data.filter(comment => comment.CommentedAdvert === ad.id);
      setComments(filteredComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  // When the read more button is pressed get all the comments from the database and filter out the search to only dsplay the ones associated with that advert
  const handleCloseModal = () => {
    setModalAdBox(null);
    setComments([]);
  };

  const handleSubmitComment = async (event) => {

    if (accessToken === null) {

      event.preventDefault();
      alert("Can't write comment if you are not logged in!")
      setCommentText('');
      //If the user isnt logged in they cant post a comment

    } else {

      event.preventDefault();
      try {
        const username = dec.username;
    
        await axios.post(`http://127.0.0.1:8000/api/create-comment/${modalAdBox.id}/`, {
  
          UserComment: commentText,
          CommentOwner: username,
  
        },{
  
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
          
        });
       
        setCommentText('');
        handleReadMore(modalAdBox); 
        //If all data is ok then an add comment request is sent with the header containing token
  
      } catch (error) {
        console.error('Error submitting comment:', error);
      }

    }

  };

  const handleEmailSubmit = async (event) => {

    if (accessToken === null) {

      event.preventDefault();
      alert("Can't send email if you are not logged in!")
      setCommentText('');
      //Error for users that arent signed in, they cant send emails

    } else {
      event.preventDefault();
      try {
          
        // Retrieve CSRF token from the cookie
        const csrftoken = Cookies.get('csrftoken');
        
        const parsedToken = JSON.parse(token);
        const accessToken = parsedToken.access;
        const dec = jwtDecode(accessToken);
        const email = dec.email;

        await axios.post(
          `http://127.0.0.1:8000/api/send-mail/`,
          {
            subject: subject,
            message: emailContent,
            recipient: recipient,
            sender: "freelancenexus1@gmail.com"

          }, { headers: {
            'Authorization': `Bearer ${accessToken}`,
            'X-CSRFToken': csrftoken,
          }}
        );
        //Request sent to backend with authorizaton tokens and body of email

        setSubject('');
        setEmailContent('');
        setRecipient('');


      } catch (error) {
        console.error('Error sending email:', error);
      }
    }
  };

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

  return (
    <>
      <SearchBar setResults = {setResults}/>
      <SearchBarList results = {results} />
      
      <div className="ads-container">

        {adverts.map(ad => (

          <div key={ad.id} id={`ad-${ad.id}`} className="ad-box">

            <p>{ad.AdTitle}</p>
            <p>{ad.AdDesc}</p>
            <p>Payment: £{ad.AdPay}</p>
            <p>Date: {formatDT(ad.AdDate)}</p>
            <p>Posted By: {ad.AdOwner}</p>
            <button className='readmore' onClick={() => handleReadMore(ad)}>Read More</button>

          </div>

        ))}

      </div>

      {modalAdBox &&  (

        <div className="modal">

          <div className="modal-content">

            <span className="close-btn" onClick={handleCloseModal}>&times;</span>

            <p>{modalAdBox.AdTitle}</p>
            <p>{modalAdBox.AdDesc}</p>
            <p>Payment: £{modalAdBox.AdPay}</p>
            <p>Date: {formatDT(modalAdBox.AdDate)}</p>
            <p>Posted By: {modalAdBox.AdOwner}</p>

            {/* Comment Box */}

            <form onSubmit={handleSubmitComment}>

              <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Enter your comment here"/>

              <button type="submit">Submit Comment</button>

            </form>

            {/* Display comments */}
            <div>

              <h2>Comments</h2>

              {comments.map(comment => (

                <div key={comment.id}>

                  {/* Display comment owner username as a hyperlink if accessToken is not null */}
                  <p>

                    {accessToken ? (
                      <a href="#" onClick={() => {

                        setRecipient(comment.CommentOwnerEmail);
                        //Recipient for email is automatically set and cant be changed, gets the commentowners email information and sets as recipient
                        setSubject(`Regarding your comment on ${modalAdBox.AdTitle}`);

                        setEmailContent(`Hi ${comment.CommentOwner},\n\n${dec.username} here! I have a question about your comment on the advertisement "${modalAdBox.AdTitle}".\n\n`);
                        //Default subject body of email made which users can later change
                      }}>

                        {comment.CommentOwner}

                      </a>
                    ) : (

                      comment.CommentOwner

                    )}: {comment.UserComment}

                  </p>

                  <p>&nbsp;&nbsp;&nbsp;{formatDT(comment.CommentTime)}</p>

                </div>

              ))}
            </div>
          </div>
        </div>
      )}


      {/* Email Modal */}
      {accessToken && recipient && (

        <div className="modal">

          <div className="modal-content">

            <span className="close-btn" onClick={() => setRecipient('')}>&times;</span>

            <h2>Send Email</h2>

            <form onSubmit={handleEmailSubmit}>

              <input type="text" placeholder="Recipient Email" value={recipient} readOnly/>

              <input type="text" placeholder="Subject" value={subject} onChange={(e) => setSubject(e.target.value)}/>

              <textarea placeholder="Email Content" value={emailContent} onChange={(e) => setEmailContent(e.target.value)}/>

              <button type="submit">Send Email</button>

            </form>

          </div>

        </div>

      )}

    </>
  );
}

export default Home;
