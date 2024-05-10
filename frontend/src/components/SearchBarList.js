import React from 'react'
import './SearchBarList.css'
import { SearchResults } from './SearchResults'

const SearchBarList = ({ results }) => {
  return (
    <div className='results-list'>

      {

        results.map((result, id) => {   

          return <SearchResults result = {result} key={id}/>
          //Returns all the results individually as single objects so that they can be clicked

        })  

      }


    </div>
  )
}

export default SearchBarList