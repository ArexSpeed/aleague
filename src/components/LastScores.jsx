import { Link } from "react-router-dom";
import { scores } from "../data/matches";
import { BsTriangleFill } from "react-icons/bs";
import "../styles/Home.scss";
import Table from "./Table";
import { useState } from "react";
import video1 from "../videos/video1.mp4";
import News from "./News";

const LastScores = () => {
  const [play, setPlay] = useState(false);
  const results = scores.map((score, index) => (
    <Link to={`/match/${index}`} className="score__box btn-slide-center-out">
      <div className="score__box-team_host">{score.host.name}</div>
      <div className="score__box-score_result">
        <span className="score__box-score_host">{score.host.score}</span>
        <span className="score__box-score_guest">{score.guest.score}</span>
      </div>
      <div className="score__box-team_guest">{score.guest.name}</div>
    </Link>
  ));

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
      <section id="table">
        <div className="sectionLine">
          <span className="sectionLine__title">Table</span>
        </div>
        <div className="container">
          <Table />
        </div>
      </section>

      <section className="last__score">
        <div className="sectionLine">
          <span className="sectionLine__title">Last Scores</span>
        </div>
        <div className="container">{results}</div>
      </section>

      <section className="last__news" id="news">
        <div className="sectionLine">
          <span className="sectionLine__title">Latest News</span>
        </div>
        <div className="container">
          <News
            id={1}
            title="Victory promote to Atland Cup Final"
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore vitae corporis quam voluptatem animi deserunt, officia
                beatae nisi quaerat nemo. "
          />
          <News
            id={2}
            title="Final Analise after the best macth in the world"
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore vitae corporis quam voluptatem animi deserunt, officia
                beatae nisi quaerat nemo. Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore vitae corporis quam voluptatem animi deserunt, officia
                beatae nisi quaerat nemo."
          />
          <News
            id={3}
            title="Third news"
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Inventore vitae corporis quam voluptatem animi deserunt, officia
                beatae nisi quaerat nemo."
          />
        </div>
      </section>

      <section className="last__video">
        <div className="sectionLine">
          <span className="sectionLine__title">Latest Video</span>
        </div>
        <div className="container">
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
              src={video1}
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
              src={video1}
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
        </div>
      </section>

      {/* <video
        src={video1}
        className="video__background"
        onMouseEnter={videoPlay}
        onMouseLeave={videoStop}
      /> */}
    </>
  );
};

export default LastScores;
