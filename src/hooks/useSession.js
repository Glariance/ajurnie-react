
import { useState, useEffect } from "react";
import { getUser, logout } from "../api/api";

export default function useSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("auth_token"));

  useEffect(() => {
    getUser()
      .then((data) => setUser(data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return { user, loading, logout, token };
}
