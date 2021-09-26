import { useState } from "react";
import Votes from "./Votes";

const Aside = () => {
  const [tab, setTab] = useState("Vote");
  return (
    <div className="aside">
      <div className="aside__header">
        <button
          className={`${tab === "Vote" && "active"}`}
          onClick={() => setTab("Vote")}
        >
          Vote
        </button>
        <button
          className={`${tab === "Stats" && "active"}`}
          onClick={() => setTab("Stats")}
        >
          Stats
        </button>
      </div>
      {tab === "Vote" ? (
        <div className="aside__content">
          <div className="aside__content-title">AWARD VOTING</div>
          <div className="aside__content-subtitle">
            Vote for best player in this season
          </div>
          <div className="aside__content-container">
            <Votes />
          </div>
        </div>
      ) : (
        <div className="aside__content">Stats</div>
      )}
    </div>
  );
};

export default Aside;
