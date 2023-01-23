import React, { useEffect, useState } from "react";
import "./Banner.css";
import BannerImage from "../../assets/header-image.jpeg";

interface Banner {
  mobile: boolean;
}

function Banner({ mobile }: Banner) {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    handleScroll();

    window.addEventListener("scroll", handleScroll);
  }, [window.scrollY]);

  return (
    <div className="banner">
      <img
        style={{
          filter: `saturate(${1 - scrollY / 500})`,
        }}
        className={mobile ? "banner-image-mobile" : "banner-image"}
        src={BannerImage}
        alt="banner"
      />
    </div>
  );
}

export default Banner;
