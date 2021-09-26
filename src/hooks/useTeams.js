import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Provider";
import axios from "axios";

const useTeams = () => {
  const [{ url }] = useContext(Context);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchTeams = async () => {
      const { data } = await axios.get(`${url}/api/teams`);
      setTeams(data);
      setLoading(false);
    };

    fetchTeams();
  }, [url]);

  return { teams, loading };
};

export default useTeams;
