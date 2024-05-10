import React from 'react';
import './Button.css';
import {Link} from 'react-router-dom';

//Styles for buttons

const STYLE = ['btn--primary', 'btn--outline']

const SIZE = ['btn--medium', 'btn--large']


export const Button = ({children, type, onClick, buttonStyle, buttonSize}) => {

    const cButtonStyle = STYLE.includes(buttonStyle) ? buttonStyle : STYLE[0];
    //checks if style is valid else assigns default style and size

    const cButtonSize = SIZE.includes(buttonSize) ? buttonSize : SIZE[0];

    return (
        
        <Link to='/register' className='btn-mobile'>

            <button className={`btn ${cButtonStyle} ${cButtonSize}`} onClick={onClick} type={type}>

                {children}
                
            </button>

        </Link>

    )

};