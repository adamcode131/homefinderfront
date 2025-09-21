import { useState } from "react";

export default function LoginTest(){
    const [token , setToken] = useState('');
    const handleSubmit = (e)=>{
        e.preventDefault();  
        fetch('http://localhost:8000/api/logintest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: e.target.name.value,
                password: e.target.password.value
            })
        }).then(res => res.json()).then(data => setToken(data.token));
    }
    return(
        <>
            <h1>Login</h1>
            <form action="" onSubmit={handleSubmit}>
                <input type="text" name="name" id="" />
                <input type="password" name="password" id="" />
                <button type="submit">Login</button>
            </form>
        </>
    )
}