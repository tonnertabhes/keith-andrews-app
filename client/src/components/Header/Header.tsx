import React from "react";
import * as FaIcons from "react-icons/fa";
import "./Header.css";

interface Header {
  mobile: boolean;
  setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
  bioRef: any;
  mediaRef: any;
  showsRef: any;
  contactRef: any;
}

function Header({
  mobile,
  setMenuActive,
  bioRef,
  mediaRef,
  showsRef,
  contactRef,
}: Header) {
  const scrollTo = (x: any) => {
    x.current.scrollIntoView({ behaviour: "smooth", block: "start" });
  };

  return (
    <div className="header">
      {mobile ? (
        <div className="header-text">
          <h3 className="header-title">KEITH ANDREWS</h3>
          <div className="menu-toggle" onClick={() => setMenuActive(true)}>
            <FaIcons.FaBars className="menu-toggle-icon" />
          </div>
        </div>
      ) : (
        <div className="header-text">
          <button
            className="header-buttons left"
            onClick={() => scrollTo(bioRef)}
          >
            BIO
          </button>
          <button
            className="header-buttons left"
            onClick={() => scrollTo(mediaRef)}
          >
            MEDIA
          </button>
          <h3 className="header-title">KEITH ANDREWS</h3>
          <button
            className="header-buttons right"
            onClick={() => scrollTo(showsRef)}
          >
            SHOWS
          </button>
          <button
            className="header-buttons right"
            onClick={() => scrollTo(contactRef)}
          >
            CONTACT
          </button>
        </div>
      )}
    </div>
  );
}

export default Header;
