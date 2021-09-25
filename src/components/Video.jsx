import React, {useState} from 'react';
import { BsTriangleFill } from "react-icons/bs";
import video1 from "../videos/video1.mp4";
import video2 from "../videos/video2.mp4";
import video3 from "../videos/video3.mp4";
import '../styles/Video.scss';

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
        <div className="video__btn-circle">
          {play ? "" : <BsTriangleFill className="video__btn-triangle" />}
        </div>
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
        <div className="video__btn-circle">
          {play ? "" : <BsTriangleFill className="video__btn-triangle" />}
        </div>
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
        <div className="video__btn-circle">
          {play ? "" : <BsTriangleFill className="video__btn-triangle" />}
        </div>
        <div className="video__title">Third news</div>
      </div>
    </>
  );
}

export default Video
