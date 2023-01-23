import React, { useEffect, useState } from "react";
import { API_ADDRESS } from "../../constants/constants";
import "./Shows.css";

function Shows({ showsRef, loggedIn, setAddShowsActive }: any) {
  const [shows, setShows] = useState<show[]>([]);
  async function getShows() {
    let response = await fetch(API_ADDRESS + "getshows", {
      method: "GET",
    });
    let data = await response.json();

    return data;
  }

  interface show {
    id: string;
    title: string;
    venue: string;
    date: string;
    link: string;
  }

  useEffect(() => {
    getShows().then((res) => {
      setShows(res);
    });
  }, []);

  function deleteShow(id: any) {
    if (localStorage.getItem("token") === null) return;

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "text/plain");
    myHeaders.append(
      "Set-Cookie",
      `access_token=${
        localStorage.getItem("token") as string
      }; HttpOnly; SameSite=None; Secure; Path=/deleteshow; Domain=${API_ADDRESS}`
    );

    var requestOptions: RequestInit = {
      credentials: "include",
      method: "DELETE",
      headers: myHeaders,
    };

    fetch(API_ADDRESS + `/deleteshow/${id}`, requestOptions)
      .then((response) => response.text())
      .then((result) => console.log(result))
      .catch((error) => console.log("error", error));
  }

  return (
    <div className="shows" ref={showsRef}>
      <div className="shows-header">SHOWS</div>
      <div className="shows-body">
        {shows === null || shows.length === 0 ? (
          <div className="show-text">No upcoming shows.</div>
        ) : (
          shows.map((show, index) => (
            <div className="show" key={index}>
              <div className="show-name">{show.title}</div>
              {loggedIn ? (
                <button
                  className="delete-btn"
                  onClick={() => deleteShow(show.id)}
                >
                  X
                </button>
              ) : (
                <></>
              )}
              <a href={show.link}>
                <button className="ticket-btn">Get Tickets</button>
              </a>
              <div className="show-details">
                <div className="show-venue">{show.venue}</div>
                <div className="show-date">{show.date}</div>
              </div>
            </div>
          ))
        )}
        {loggedIn ? (
          <div className="show-text">
            <button className="add-btn" onClick={() => setAddShowsActive(true)}>
              Add Shows
            </button>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}

export default Shows;
