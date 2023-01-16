import React from 'react'
import { useState, useEffect} from 'react'
import User from './User.png'
import Lock from './lock.png'
import LoginButton from './LoginButton.png'
import GoogleButton from './Google.png'
import AppleButton from './AppleID.png'
import FacebookButton from './Facebook.png'
import { Link, useNavigate } from 'react-router-dom'
import './register.css'

function RegisterForm({ setToken }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (event) =>  {
        // Prevents automatically refreshing page
        event.preventDefault()

        // Sending form data to MongoDB 
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: email , password: password, name: name})
        };

        fetch(process.env.REACT_APP_API + "/register", requestOptions)
        .then( (response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Something went wrong');
        })
        .then( (data) => {
            // Go to another page in React
            if (data.success) {
                setToken(data.jwt);
                navigate('/folder')
            }
            else {
                alert('Email already in use')
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
                <div className='signup'>
                    <label>Sign Up</label>
                </div>
                <div className="txtfields">
                    <label className="email">
                        <input type="email" placeholder='Username or Email Address' id='email' name='email' className='emailfield' value={email} onChange={(event) => setEmail(event.target.value)}/>
                    </label><br></br>
                    <label className="password">
                        <input type="password" placeholder='Password' id='password' className='inputPassword' name='password' value={password} onChange={(event) => setPassword(event.target.value)}/>
                    </label><br></br>
                    <label className="confirmpassword">
                        <input type="password" placeholder='Confirm password' id='confirmpassword' className='inputPassword' name='name' value={name} onChange={(event) => setName(event.target.value)}/>
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
                    <button className="imgButton">
                        <img src={LoginButton} />
                    </button>
                </div>
                <div className='redirectback'>
                    <Link to="/login">
                        <label className='logintxt'>
                            Already have account?
                        </label>
                    </Link>
                </div>
                <div className='signupwith'>
                    <label className='signupwithtxt'>sign up with</label>
                </div>
            </form>
            <form action="http://localhost:5000/" method="POST">
                <div className='threebuttonsregister'>
                    <button className='googlebutton imgButton'>
                        <img src={GoogleButton} />
                    </button>
                    <button className='applebutton imgButton'>
                        <img src={AppleButton} />
                    </button>
                    <button className='facebookbutton imgButton'>
                        <img src={FacebookButton} />
                    </button>
                </div>
            </form>
        </div>

    )
}

export default RegisterForm