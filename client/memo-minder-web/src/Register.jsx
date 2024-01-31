import React, {useState} from "react"

export const Register = (props) => {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [name, setName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const handleSubmit = (e) =>{
        e.preventDefault();

        if (!passwordsMatch) {
            console.error("Passwords do not match");
            return;
          }

        console.log(email);
    }

    const handleConfirmPassChange = (e) => {
        const confirmPassword = e.target.value;
        setConfirmPass(confirmPassword);
        setPasswordsMatch(confirmPassword === pass);
      }
    
    return (
        <div className="auth-form-container">
            <h2>Register</h2>
        <form className="register-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Full Name</label>
            <input value={name} onChange={(e) => setName(e.target.value)} type="name" id="name" placeholder="Full Name" />
            <label htmlFor="email">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Your Email" id="email" name="email" />
            <label htmlFor="password">Password</label>
            <input value={pass} onChange={(e) => setPass(e.target.value)} type="password" placeholder="********" id="password" name="password" />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input value={confirmPass} onChange={handleConfirmPassChange} type="password" placeholder="********" id="confirmPassword" name="confirmPassword"/>
            
            {!passwordsMatch && <p style={{ color: 'red' }}>Passwords do not match</p>}
            <button className="login-btn" type="submit">Sign up</button>
        </form>
        <button className="link-btn" onClick={() => props.onFormSwitch('login')}>Already have an account? Login here.</button>
    </div>
    )
}