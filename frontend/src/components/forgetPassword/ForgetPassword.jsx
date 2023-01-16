import React from 'react'
import { useState, useEffect } from 'react'
import Mail from './Mail.png'
import LoginButton from './LoginButton.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './forgotPassword.css'

function ForgetPasswordForm() {

    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const [passwordShown, setPasswordShown] = useState(false);
    const togglePassword = () => {
        setPasswordShown(!passwordShown);
    }

    const handleSubmit = (event) =>  {
        // Prevents automatically refreshing page
        event.preventDefault()

        // Sending form data to MongoDB 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email })
        };

        fetch(process.env.REACT_APP_API + "/forgot", requestOptions)
        .then( (response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
        .then( (data) => {
            // Go to another page in React
            if (data.success) {
                navigate('/reset')
            }
            else {
                alert('you are not a user :/')
            }
        })
        .catch( (error) => console.log(error))
        
    }

    useEffect(() => {
        document.body.classList.add('accountForm')
    });

    return (
        <div className="accountForm">
            <form onSubmit={handleSubmit}>
                <div className='resetpassword'>
                    <label>Forgot Password?</label>
                </div>
                <div className="txtfields">
                    <label className="email">
                        <input type="text" placeholder='Enter your email address' id='email' name='email' className='emailfield' value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </label><br></br>
                </div>
                <div className='resetinstructions'>
                    <label className='asterisk'>*</label>
                    <label className='SendMessagetxt'>
                    We will send you a message to set or reset
                    </label>
                    <br></br>
                    <label className='sendMessagetxtcontinued'>
                        your new password
                    </label>
                    <div className='mail'>
                        <img src={Mail} />
                    </div>
                </div>
                <div className='loginbutton'>
                    <label className='SendCodetxt'>
                        Send Code
                    </label>

                        <button className='login2 imgButton'>
                            <img src={LoginButton} />
                        </button>
                </div>
            </form>
        </div>
    )
}

export default ForgetPasswordForm