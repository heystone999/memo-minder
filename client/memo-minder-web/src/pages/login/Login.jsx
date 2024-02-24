import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import './login.css';

export const Login = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) =>{
        e.preventDefault();

        // Transfer to Home
        navigate("/");
    }

    return (
        <div className="login">
            <div className="auth-form-container" >
                <h2>Login</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <label htmlFor="email">Email / User Name</label>
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" id="email" name="email" />
                    <label htmlFor="password">Password</label>
                    <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
                    <button className="login-btn" type="submit">Log In</button>
                </form>
                <Link to="/register">
                    <button className="link-btn">Don't have an account? Register.</button>
                </Link>
            </div>
        </div>
    )
}
