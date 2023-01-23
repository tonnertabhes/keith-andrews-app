import React from "react";
import HeadShot from "../../assets/headshot.png";
import "./Bio.css";

function Bio({ bioRef }: any) {
  return (
    <div className="bio" ref={bioRef}>
      <div className="bio-header">BIOGRAPHY</div>
      <div className="head-bio">
        <img className="headshot" src={HeadShot} alt="headshot" />
        <div className="bio-body">
          Keith Andrews was born and raised in Toronto, Ontario. He is the
          current host of "Comedy Night Tonight!" at Tonight Bar, the former
          co-host of the "Its Alive!!! Comedy Show", and part of the Yuk Yuks
          Rising Stars of Comedy Wednesdays. Keith has opened for Ian Sirota.
          Recently, Keith performed in the JFLToronto festival and was a
          finalist in the 420 Comedy competition. His comedic observations come
          from the perspective of an inept every-man, trying to do the right
          thing, often for the wrong reasons. Keith performs all over the GTA
          and surrounding Ontario.
        </div>
      </div>
    </div>
  );
}

export default Bio;
