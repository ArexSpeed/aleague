import { useContext } from "react";
import { Context } from "../context/Provider";
import { Link } from "react-router-dom";

const ArticleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    enable-background="new 0 0 24 24"
    height="16px"
    viewBox="0 0 24 24"
    width="16px"
    fill="#ffffff"
  >
    <g>
      <path d="M0,0h24v24H0V0z" fill="none" />
    </g>
    <g>
      <path d="M16,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V8L16,3z M19,19H5V5h10v4h4V19z M7,17h10v-2H7V17z M12,7H7 v2h5V7z M7,13h10v-2H7V13z" />
    </g>
  </svg>
);

const InterviewIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 0 24 24"
    width="16px"
    fill="#ffffff"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M15 4v7H5.17l-.59.59-.58.58V4h11m1-2H3c-.55 0-1 .45-1 1v14l4-4h10c.55 0 1-.45 1-1V3c0-.55-.45-1-1-1zm5 4h-2v9H6v2c0 .55.45 1 1 1h11l4 4V7c0-.55-.45-1-1-1z" />
  </svg>
);

const ReportIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 0 24 24"
    width="16px"
    fill="#ffffff"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" />
  </svg>
);

const TransferIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16px"
    viewBox="0 0 24 24"
    width="16px"
    fill="#ffffff"
  >
    <path d="M0 0h24v24H0V0z" fill="none" />
    <path d="M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z" />
  </svg>
);

function NewsCard({ id, category, image, title, text, teams, style }) {
  const [{ darkTheme }] = useContext(Context);
  return (
    <Link
      to={`/news/${id}`}
      className="news__box btn-border-move"
      style={style}
    >
      <div className="news__box-container">
        <div className="news__box-image">
          <div
            className={`news__box-image-type ${
              category === "Interview" && "interview"
            } ${category === "Article" && "article"} ${
              category === "Report" && "report"
            } ${category === "Transfer" && "transfer"}`}
          >
            {category === "Interview" && <InterviewIcon />}
            {category === "Article" && <ArticleIcon />}
            {category === "Report" && <ReportIcon />}
            {category === "Transfer" && <TransferIcon />}
            <span
              style={{ fontSize: "12px", paddingLeft: "4px", color: "#ffffff" }}
            >
              {category}
            </span>
          </div>
          <img src={image} alt="img" className="news__box-image" />
        </div>
        <div className={`news__box-content ${darkTheme && "dark"}`}>
          <div className={`news__title ${darkTheme && "dark"}`}>{title}</div>
          <div className={`news__text ${darkTheme && "dark"}`}>
            {text.length > 150 ? text.slice(150) + "..." : text}
          </div>
          <div className="news__avatars">
            {teams.map((image) => (
              <img src={image} alt="av" className="news__avatars-img" />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default NewsCard;
