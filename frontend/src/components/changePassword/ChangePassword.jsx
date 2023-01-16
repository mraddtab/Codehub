import React from 'react'
import { useState, useEffect } from 'react'
import User from './User.png'
import Lock from './lock.png'
import LoginButton from './LoginButton.png'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import './changePassword.css'

function ChangePasswordForm() {

    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
            body: JSON.stringify({ token: token, password: password, confirmPassword: confirmPassword })
        };

        fetch(process.env.REACT_APP_API + "/reset", requestOptions)
        .then( (response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
        .then( (data) => {
            // Go to another page in React
            if (data.success) {
                navigate('/login')
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
                <div className='changepassword'>
                    <label>Change Password</label>
                </div>
                <div className="txtfields">
                    <label className="email">
                        <input type="text" placeholder='Code' id='token' name='token' className='emailfield' onChange={(event) => setToken(event.target.value)}/>
                    </label><br></br>
                    <label className="password">
                        <input type={passwordShown ? "text" : "password"} placeholder='New password' id='password' className='inputPassword' name='password' onChange={(event) => setPassword(event.target.value)}/>
                    </label><br></br>
                    <label className="confirmpassword">
                        <input type={passwordShown ? "text" : "password"} placeholder='Confirm new password' id='confirmPassword' name='confirmPassword' onChange={(event) => setConfirmPassword(event.target.value)}/>
                    </label>
                    <div className='userregister'>
                        <img src={User} />
                    </div>
                    <div className='lockregister1'>
                        <img src={Lock} />
                    </div>
                    <div className='lockregister2'>
                        <img src={Lock} />
                    </div>
                </div>
                <div className='loginbutton'>
                    <button className='imgButton'>
                        <img src={LoginButton} />
                    </button>
                </div>
                <div className='redirectback'>
                    <Link to="/login">
                        <label className='logintxt'>
                            Remember password?
                        </label>
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default ChangePasswordForm