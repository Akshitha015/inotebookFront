import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Signup = (props) => {
    const [credentials,setCredentials]=useState({name:"",email:"",password:"",cpassword:""});
    const navigate=useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const {name,email,password}=credentials;
        console.log("hiii")
        const response = await fetch("http://localhost:5000/api/auth/createuser", {
            
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({name,email,password})
        });
        console.log("function call")
        const json = await response.json();
        console.log(json);
            // Save the auth-token and redirect
            if(json.success){
                localStorage.setItem('auth-token', json['authtoken']);
                navigate('/');
                props.showAlert("Account Created Successfully","success");
            }else{
                props.showAlert("Invalid Details","danger");
            }
    };

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <div className="container">
            <form onSubmit={handleSubmit}>
                <div className=" mb-3">
                    <label htmlFor="name" className="form-label">Name</label>
                    <input type="text" className="form-control" id="name" name="name" onChange={onChange} aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">email</label>
                    <input type="email" className="form-control" id="email"  onChange={onChange} name="email"/>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" onChange={onChange} name="password" />
                </div>
                

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Signup