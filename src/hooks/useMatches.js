import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Provider";
import axios from "axios";

const useMatches = () => {
  const [{ url }] = useContext(Context);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchMatches = async () => {
      const { data } = await axios.get(`${url}/api/matches`);
      setMatches(data);
      setLoading(false);
    };

    fetchMatches();
  }, [url]);

  return { matches, loading };
};

export default useMatches;
