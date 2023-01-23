import React, { useState } from "react";
import Cookies from "js-cookie";
import "./Login.css";
import { API_ADDRESS } from "../../constants/constants";

interface Login {
  history: any;
}

function Login<Login>({ setLoginModal, setLoggedIn }: any) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.className === "userInput") {
      setUserName(e.target.value);
      return;
    }
    setPassword(e.target.value);
  }

  async function logIn() {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");

    var raw = `{\n    "username": "${userName}",\n    "password": "${password}"\n}`;

    interface RequestOptions {
      method: string;
      headers: Headers;
      body: string;
    }

    var requestOptions: RequestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    const res = await fetch(API_ADDRESS + "/login", requestOptions);
    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data);
      setLoginModal(false);
      setLoggedIn(true);
    } else {
      window.alert("Incorrect username/password");
      return new Error("Login Unsuccessful");
    }
  }

  return (
    <div className="login-container">
      <p>Hello</p>
      <div className="login">
        <p onClick={() => setLoginModal(false)}>X</p>
        <h2>Admin Login</h2>
        <input
          className="userInput"
          onChange={(e) => handleChange(e)}
          type="text"
          placeholder="Username"
        ></input>
        <input
          className="password"
          onChange={(e) => handleChange(e)}
          type="password"
          placeholder="Password"
        ></input>
        <button className="btn" placeholder="login" onClick={() => logIn()}>
          Log In
        </button>
      </div>
    </div>
  );
}

export default Login;
