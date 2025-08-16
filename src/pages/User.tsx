import { useEffect, useState } from "react";
import api from "../api/api.ts";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        await api.get("/sanctum/csrf-cookie");
        const res = await api.get("/api/user");
        setUser(res.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <p>Loading user data...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Info</h1>
      {user ? (
        <pre>{JSON.stringify(user, null, 2)}</pre>
      ) : (
        <p>No authenticated user found.</p>
      )}
    </div>
  );
}
