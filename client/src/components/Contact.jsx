import React from 'react'
import { useNavigate } from 'react-router'

const Contact = () => {
    const navigate=useNavigate()
  return (
    <div className='color'>
    <div className='contact-background'>
        <div className='bottom-main-content'>
            <h1>Tomato.</h1>
            <p>At Tomato, we strive to deliver every order with utmost sincerity and care. Each dish is prepared with love and crafted with the heartfelt dedication of our team.</p>
            <div className='bottom-icons'>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-facebook-f"></i></a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-twitter"></i></a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><i className="fa-brands fa-linkedin-in"></i></a>
            </div>
        </div>
        
        <div className='get-in-touch'>
            <h1>GET IN TOUCH</h1>
            <p>+91 6302176979</p>
            <p>tomato@gmail.com</p>

        </div>
    </div>
    <div className='con-con'>
    <p className='copy'>Copyright 2024 <i className="fa-regular fa-copyright"></i> Tomato.com-All Rights Reserved.</p>
    <p className='copy-cat'>Created by  <a href="https://www.linkedin.com/in/gopala-krishna-pinapathuni-aa05a5366/" target="_blank" rel="noopener noreferrer">@Gopala Krishna</a></p>

    </div>
    
    </div>
  )
}

export default Contact