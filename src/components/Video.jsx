import { useState } from "react";
import video1 from "../videos/video1.mp4";
import video2 from "../videos/video2.mp4";
import video3 from "../videos/video3.mp4";

const PlayIcon = () => (
  <svg
    className="video__btn-triangle"
    fill="currentColor"
    viewBox="0 0 20 20"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
      clipRule="evenodd"
    />
  </svg>
);

const Video = () => {
  const [play, setPlay] = useState(false);

  const videoPlay = (e) => {
    let video = e.target;
    setPlay(true);
    video.play();
  };
  const videoStop = (e) => {
    let video = e.target;
    setPlay(false);
    video.pause();
  };

  return (
    <>
      <div className="video__box">
        <video
          src={video1}
          id="video1"
          className="video__background"
          onClick={videoPlay}
          onMouseEnter={videoPlay}
          onMouseLeave={videoStop}
        >
          {" "}
        </video>
        <div className="video__btn-circle">{play ? "" : <PlayIcon />}</div>
        <div className="video__title">Third news</div>
      </div>

      <div className="video__box">
        <video
          src={video2}
          id="video2"
          className="video__background"
          onClick={videoPlay}
          onMouseEnter={videoPlay}
          onMouseLeave={videoStop}
        >
          {" "}
        </video>
        <div className="video__btn-circle">{play ? "" : <PlayIcon />}</div>
        <div className="video__title">Third news</div>
      </div>

      <div className="video__box">
        <video
          src={video3}
          id="video3"
          className="video__background"
          onClick={videoPlay}
          onMouseEnter={videoPlay}
          onMouseLeave={videoStop}
        >
          {" "}
        </video>
        <div className="video__btn-circle">{play ? "" : <PlayIcon />}</div>
        <div className="video__title">Third news</div>
      </div>
    </>
  );
};

export default Video;
