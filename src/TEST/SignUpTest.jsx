import { useState } from "react";

export default function Signuptest() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(""); 
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent form reload

    try {
      const resp = await fetch("http://localhost:8000/api/createUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          password: password,
          email : email
        }),
      });

      const data = await resp.json();

      if (data.token) {
        setToken(data.token);
        localStorage.setItem("token", data.token); // save to localStorage
        console.log("Signup successful! Token saved:", data.token);
      } else {
        console.error("Signup failed:", data);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <>
      <h1>Signup Page</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /> 
        <input
          type="email"
          placeholder="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /> 
        
        <button type="submit">Signup</button>
      </form>

      {token && <p>✅ Signed up! Token stored in localStorage.</p>}
    </>
  );
}
