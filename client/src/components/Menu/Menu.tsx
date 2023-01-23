import React, { useState } from "react";
import * as IoIcons from "react-icons/io";
import "./Menu.css";

interface Menu {
  menuActive: boolean;
  setMenuActive: React.Dispatch<React.SetStateAction<boolean>>;
  bioRef: any;
  mediaRef: any;
  showsRef: any;
  contactRef: any;
}

function Menu({
  menuActive,
  setMenuActive,
  bioRef,
  mediaRef,
  showsRef,
  contactRef,
}: Menu) {
  const scrollTo = (x: any) => {
    setMenuActive(false);
    x.current.scrollIntoView({ behaviour: "smooth", block: "start" });
  };

  return (
    <>
      <div className={menuActive ? "menu" : "menu inactive"}>
        <div className="menu-buttons">
          <button className="close-btn" onClick={() => setMenuActive(false)}>
            <IoIcons.IoIosCloseCircle color="yellow" />
          </button>
          <button className="menu-button" onClick={() => scrollTo(bioRef)}>
            BIO
          </button>
          <button className="menu-button" onClick={() => scrollTo(mediaRef)}>
            MEDIA
          </button>
          <button className="menu-button" onClick={() => scrollTo(showsRef)}>
            SHOWS
          </button>
          <button className="menu-button" onClick={() => scrollTo(contactRef)}>
            CONTACT
          </button>
        </div>
      </div>
    </>
  );
}

export default Menu;
