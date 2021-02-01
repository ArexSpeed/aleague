import React, { useState, useEffect } from "react";
//import {votes} from '../data/voting'
import {Percent} from './AwardsElement'
import axios from 'axios';

import "../styles/Awards.scss";


const AwardsSite = () => {
  const [votes, setVotes] = useState([])
  const [votesStatus, setVoteStatus] = useState(false)
  const [votesPoints, setVotePoints] = useState(false)
  const [sumPoints, setSumPoints] = useState({})
  const [voteResult, setVoteResult] = useState({
    goalkeeper: '',
    defender: '',
    midfielder: '',
    forward: '',
    coach: ''
  })

  useEffect(() => {
    const fetchVotes = async () => {
      const { data } = await axios.get('/api/votes')
      console.log(data, 'Teams')
      setVotes(data)
    }

    fetchVotes()
  }, [])

  

  const countPoints = () => {
    axios.post('/api/votes', voteResult)
    let pointsSum = votes.find(vote => vote.allPoints)
    setVotePoints(true)
    setSumPoints(pointsSum)
  }

  const voteSend = (e) => {
    e.preventDefault()
    setVoteStatus(true)
    console.log('All Votes', voteResult)
    countPoints()
  }

  const voteGoalkeeper = (e) => {
    setVoteResult({...voteResult, goalkeeper: e.target.value})
  }

  const voteDefender = (e) => {
    setVoteResult({...voteResult, defender: e.target.value})
  }

  const voteMidfielder = (e) => {
    setVoteResult({...voteResult, midfielder: e.target.value})
  }

  const voteForward = (e) => {
    setVoteResult({...voteResult, forward: e.target.value})
  }
  const voteCoach = (e) => {
    setVoteResult({...voteResult, coach: e.target.value})
  }
  return (
    <>
      <section>
        <div className="sectionLine">
          <span className="sectionLine__title">Awards</span>
        </div>
        <div className="container">
          <header className="tv__header">Vote for the best players</header>
          {!votesPoints ? (
            <form className="awards__boxes" onSubmit={voteSend}>
              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Goalkeepers
                </h2>
                {votes
                  .filter((vote) => vote.category === "Goalkeeper")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="goalkeeper"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteGoalkeeper}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>

              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Defenders
                </h2>

                {votes
                  .filter((vote) => vote.category === "Defender")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="defender"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteDefender}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>

              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Midfielders
                </h2>

                {votes
                  .filter((vote) => vote.category === "Midfielder")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="midfielder"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteMidfielder}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>

              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Forwards
                </h2>

                {votes
                  .filter((vote) => vote.category === "Forward")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="forward"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteForward}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>


              <div className="awards__box">
                <h2 className="awards__title">
                  <div className="awards__title-slash"></div> Coaches
                </h2>

                {votes
                  .filter((vote) => vote.category === "Coach")
                  .map((vote) => (
                    <div className="awards__checkbox">
                      <input
                        type="radio"
                        name="coach"
                        id={vote.name}
                        value={vote.name}
                        onClick={voteCoach}
                      />
                      <label for={vote.name} className="awards__label">
                        <span className="awards__span">{vote.name}</span>
                      </label>
                      <span className="awards__teamName">{vote.club}</span>
                    </div>
                  ))}
              </div>
              <button type="submit" className="awards__button">Vote</button>
            </form>
          ) : (
            <>
              <div className="awards__boxes">
                <div className="awards__box">
                  <h2 className="awards__title">
                    <div className="awards__title-slash"></div> Goalkeepers
                  </h2>

                  {votes
                    .filter((vote) => vote.category === "Goalkeeper")
                    .sort((a,b) => b.points - a.points)
                    .map((vote) => (
                      <>
                      <div className="awards__checkbox">

                        <label className="awards__label">
                          <span className="awards__span">{vote.name}</span>
                        </label>
                        <span className="awards__teamName">{vote.club}</span>
                      </div>
                      <div className="awards__points"> 
                      <Percent width={(vote.points/sumPoints.allPoints)*100}>{((vote.points/sumPoints.allPoints)*100).toFixed(2)}%</Percent>

                      </div>
          
                      </>
                    ))}
                    
                </div>

                <div className="awards__box">
                  <h2 className="awards__title">
                    <div className="awards__title-slash"></div> Defenders
                  </h2>

                  {votes
                    .filter((vote) => vote.category === "Defender")
                    .sort((a,b) => b.points - a.points)
                    .map((vote) => (
                      <>
                      <div className="awards__checkbox">

                        <label className="awards__label">
                          <span className="awards__span">{vote.name}</span>
                        </label>
                        <span className="awards__teamName">{vote.club}</span>
                      </div>
                      <div className="awards__points"> 
                      <Percent width={(vote.points/sumPoints.allPoints)*100}>{((vote.points/sumPoints.allPoints)*100).toFixed(2)}%</Percent>

                      </div>
          
                      </>
                    ))}
                    
                </div>

                <div className="awards__box">
                  <h2 className="awards__title">
                    <div className="awards__title-slash"></div> Midfielders
                  </h2>

                  {votes
                    .filter((vote) => vote.category === "Midfielder")
                    .sort((a,b) => b.points - a.points)
                    .map((vote) => (
                      <>
                      <div className="awards__checkbox">

                        <label className="awards__label">
                          <span className="awards__span">{vote.name}</span>
                        </label>
                        <span className="awards__teamName">{vote.club}</span>
                      </div>
                      <div className="awards__points"> 
                      <Percent width={(vote.points/sumPoints.allPoints)*100}>{((vote.points/sumPoints.allPoints)*100).toFixed(2)}%</Percent>

                      </div>
          
                      </>
                    ))}
                    
                </div>

                <div className="awards__box">
                  <h2 className="awards__title">
                    <div className="awards__title-slash"></div> Forwards
                  </h2>

                  {votes
                    .filter((vote) => vote.category === "Forward")
                    .sort((a,b) => b.points - a.points)
                    .map((vote) => (
                      <>
                      <div className="awards__checkbox">

                        <label className="awards__label">
                          <span className="awards__span">{vote.name}</span>
                        </label>
                        <span className="awards__teamName">{vote.club}</span>
                      </div>
                      <div className="awards__points"> 
                      <Percent width={(vote.points/sumPoints.allPoints)*100}>{((vote.points/sumPoints.allPoints)*100).toFixed(2)}%</Percent>

                      </div>
          
                      </>
                    ))}
                    
                </div>

                <div className="awards__box">
                  <h2 className="awards__title">
                    <div className="awards__title-slash"></div> Coaches
                  </h2>

                  {votes
                    .filter((vote) => vote.category === "Coach")
                    .sort((a,b) => b.points - a.points)
                    .map((vote) => (
                      <>
                      <div className="awards__checkbox">

                        <label className="awards__label">
                          <span className="awards__span">{vote.name}</span>
                        </label>
                        <span className="awards__teamName">{vote.club}</span>
                      </div>
                      <div className="awards__points"> 
                      <Percent width={(vote.points/sumPoints.allPoints)*100}>{((vote.points/sumPoints.allPoints)*100).toFixed(2)}%</Percent>

                      </div>
          
                      </>
                    ))}
                    
                </div>

              </div>
            </>
          )}

          {/* {votesStatus && (
            <div>
              <p>GK: {voten.goalkeeper}</p>
              <p>DF: {voten.defender}</p>
              <p>FW: {voten.forward}</p>
            </div>
          )} */}
          <br />
        </div>
      </section>
    </>
  );
}

export default AwardsSite
