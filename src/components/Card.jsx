import React, {useState, useEffect} from "react";
import "../styles/Card.scss";
import {stats} from '../data/stats'
import axios from 'axios'

function Card() {
  const [teams, setTeams] = useState([])
  useEffect(() => {
    const fetchTeams = async () => {
      const {data} = await axios.get('/api/teams')
      setTeams(data)
    }

    fetchTeams()
  }, [])

  const goalsArr = []
  stats.map(stat => goalsArr.push(stat))
  console.log(goalsArr);
  goalsArr.sort((a, b) => b.goals - a.goals|| b.assists - a.assists);
  const showGoals = goalsArr.map(
    (item, index) =>
      index < 5 && (
        <tr className={index===0 ? 'txt__first' : index ===1 ? 'txt__second' : index===2 ? 'txt__third' : 'txt__rest' && 'tr__card'}>
          <td><img src={teams.filter(team => team.name === item.club).map(item => item.logo)} alt='' className={index===0 ? 'img__first' : index ===1 ? 'img__second' : index===2 ? 'img__third' : 'img__rest'} /></td>
          <td>{item.name}</td>
          <td>{item.goals}</td>
          <td className="txt__shadow">{item.assists}</td>
          <td>{item.goals + item.assists}</td>
        </tr>
      )
  );
  return (
    <>
      <div className='card'>
        <table className="table__card">
          <tr className="table__card-title">
          <th>Scores</th>
          </tr>
          
          {showGoals}
        </table>
      </div>
    </>
  );
}

export default Card;
