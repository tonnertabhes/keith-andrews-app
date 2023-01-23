import React, { useEffect, useState, useRef } from "react";
import jwt_decode from "jwt-decode";
import "./App.css";
import Header from "./components/Header/Header";
import Banner from "./components/Banner/Banner";
import Bio from "./components/Bio/Bio";
import Menu from "./components/Menu/Menu";
import Contact from "./components/Contact/Contact";
import Media from "./components/Media/Media";
import Shows from "./components/Shows/Shows";
import Login from "./components/Login/Login";
import AddShowsModal from "./components/AddShowsModal/AddShowsModal";

function App() {
  const [loginModal, setLoginModal] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const bioRef = useRef(null);
  const mediaRef = useRef(null);
  const showsRef = useRef(null);
  const contactRef = useRef(null);

  const [mobile, setMobile] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [addShowsActive, setAddShowsActive] = useState(false);

  useEffect(() => {
    verifyJwt();
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1100) {
      setMobile(true);
    }
  }, []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 1100) {
        setMobile(true);
        return;
      }
      setMobile(false);
    }

    window.addEventListener("resize", handleResize);
  }, [window.innerWidth]);

  function verifyJwt() {
    const token = localStorage.getItem("token");
    if (token === null) {
      setLoggedIn(false);
      return;
    }
    var decodedToken: any = jwt_decode(token);
    var dateNow = new Date();

    if (!decodedToken) {
      setLoggedIn(false);
      return;
    }
    if (decodedToken.exp < dateNow.getTime() / 1000) {
      setLoggedIn(false);
      return;
    }

    setLoggedIn(true);
  }

  return (
    <div className="App">
      {mobile ? (
        <Menu
          contactRef={contactRef}
          showsRef={showsRef}
          mediaRef={mediaRef}
          bioRef={bioRef}
          menuActive={menuActive}
          setMenuActive={setMenuActive}
        />
      ) : (
        <></>
      )}
      {loginModal ? (
        <Login setLoggedIn={setLoggedIn} setLoginModal={setLoginModal} />
      ) : (
        <></>
      )}
      {addShowsActive ? (
        <AddShowsModal setAddShowsActive={setAddShowsActive} />
      ) : (
        <></>
      )}
      <Header
        contactRef={contactRef}
        showsRef={showsRef}
        mediaRef={mediaRef}
        bioRef={bioRef}
        setMenuActive={setMenuActive}
        mobile={mobile}
      />
      <Banner mobile={mobile} />
      <Bio bioRef={bioRef} />
      <Media mediaRef={mediaRef} />
      <Shows
        setAddShowsActive={setAddShowsActive}
        loggedIn={loggedIn}
        showsRef={showsRef}
      />
      <Contact contactRef={contactRef} setLoginModal={setLoginModal} />
    </div>
  );
}

export default App;
