import React, { useState, useRef } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";

function Contact({ contactRef, setLoginModal }: any) {
  const form = useRef(null);

  const [name, updateName] = useState("");
  const [email, updateEmail] = useState("");
  const [message, updateMessage] = useState("");

  const handleChange = (e: any) => {
    if (e.target.className === "name-input") {
      updateName(e.target.value);
    }
    if (e.target.className === "email-input") {
      updateEmail(e.target.value);
    }
    if (e.target.className === "contact-form") {
      updateMessage(e.target.value);
    }
  };

  function isValidEmail(email: string) {
    return /\S+@\S+\.\S+/.test(email);
  }

  const handleSubmit = () => {
    if (name === "" || email === "" || message === "") {
      window.alert("Please fill out all required fields");
      return;
    }
    if (!isValidEmail(email)) {
      window.alert("Please enter a valid email address");
      return;
    }
    sendEmail();
  };

  const sendEmail = () => {
    if (form.current !== null) {
      emailjs.sendForm(
        "service_csbjtjr",
        "template_0st3bmn",
        form.current,
        "rppjeRwzOpj5kgp0C"
      );
      window.alert("Message sent.");
    }
  };

  return (
    <div className="contact" ref={contactRef}>
      <div className="contact-header">CONTACT KEITH</div>
      <form ref={form} className="form" onSubmit={() => handleSubmit()}>
        <input
          name="user_name"
          className="name-input"
          placeholder="Your Name (required)"
          onChange={(e) => handleChange(e)}
        ></input>
        <input
          name="user_email"
          className="email-input"
          placeholder="Email Address (required)"
          onChange={(e) => handleChange(e)}
        ></input>
        <textarea
          name="message"
          className="contact-form"
          placeholder="Write your message here (required)"
          onChange={(e) => handleChange(e)}
        ></textarea>
        <button type="submit" className="submit-button">
          SUBMIT
        </button>
      </form>
      <button className="login-btn" onClick={() => setLoginModal(true)}>
        Log In
      </button>
    </div>
  );
}

export default Contact;
