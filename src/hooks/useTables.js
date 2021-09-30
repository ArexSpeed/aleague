import { useState, useEffect, useContext } from "react";
import { Context } from "../context/Provider";
import axios from "axios";

const useTables = () => {
  const [{ url }] = useContext(Context);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const fetchTables = async () => {
      const { data } = await axios.get(`${url}/api/tables`);
      setTables(data);
      setLoading(false);
    };

    fetchTables();
  }, [url]);

  return { tables, loading };
};

export default useTables;
