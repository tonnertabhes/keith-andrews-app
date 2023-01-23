import React from "react";
import "./Media.css";

function Media({ mediaRef }: any) {
  return (
    <div className="media" ref={mediaRef}>
      <div className="media-header">MEDIA</div>
      <div className="media-body">
        <iframe
          className="media-video"
          width="560"
          height="315"
          src="https://www.youtube.com/embed/zxHpHC1m6Rs"
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        ></iframe>
      </div>
    </div>
  );
}

export default Media;
