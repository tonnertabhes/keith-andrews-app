import React, { useState } from "react";
import { API_ADDRESS } from "../../constants/constants";
import "./AddShowsModal.css";

function AddShowsModal({ setAddShowsActive }: any) {
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");

  function handleChange(e: any) {
    switch (e.target.name) {
      case "title":
        setTitle(e.target.value);
        break;
      case "venue":
        setVenue(e.target.value);
        break;
      case "date":
        setDate(e.target.value);
        break;
      case "link":
        setLink(e.target.value);
        break;
    }
  }

  function handleSubmit(e: any) {
    if (title === "" || date === "" || venue === "") {
      window.alert("Please fill out all fields");
      return;
    }
    if (localStorage.getItem("token") === null) {
      return;
    }

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append(
      "Set-Cookie",
      `token=${localStorage.getItem("token") as string}`
    );

    var raw = `{\n    "title": "${title}",\n    "venue": "${venue}",\n    "date": "${date}",\n    "link": "${link}"\n}`;

    var requestOptions: RequestInit = {
      credentials: "include",
      method: "POST",
      headers: myHeaders,
      body: raw,
    };

    fetch(API_ADDRESS + "/createshow", requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="add-shows-modal-container">
      <div className="add-shows-modal">
        <p className="close-btn" onClick={() => setAddShowsActive(false)}>
          X
        </p>
        <h2 className="show-modal-title">Add Show</h2>
        <form onSubmit={(e) => handleSubmit(e)}>
          <label className="show-modal-text">Show Name</label>
          <input
            name="title"
            onChange={(e) => handleChange(e)}
            type="text"
          ></input>
          <label className="show-modal-text">Venue</label>
          <input
            name="venue"
            onChange={(e) => handleChange(e)}
            type="text"
          ></input>
          <label className="show-modal-text">Date</label>
          <input
            name="date"
            onChange={(e) => handleChange(e)}
            type="datetime-local"
          ></input>
          <label className="show-modal-text">Ticket Link</label>
          <input
            name="link"
            onChange={(e) => handleChange(e)}
            type="url"
          ></input>
          <input className="submit-btn" type="submit"></input>
        </form>
      </div>
    </div>
  );
}

export default AddShowsModal;
