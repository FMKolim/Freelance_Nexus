import React from 'react';
import './SearchResult.css';

export const SearchResults = ({ result }) => {
  const scrollToAd = () => {
    const adElement = document.getElementById(`ad-${result.id}`);
    const topPosition = adElement.offsetTop;

    window.scrollTo({
      top: topPosition,
      behavior: 'smooth'
    });
  };

  //After clicking on an advert, the browser scrolls the screen down to the position of the advert on the screen.

  return (
    <div className='search-result' onClick={scrollToAd}>
      {result.AdTitle}
    </div>
  );
};
