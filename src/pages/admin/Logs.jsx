import { useEffect, useState } from "react";
import { supabase } from "../../createClient"; // Adjust this path to your setup

export default function Logs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("audit_trail")
      .select(`
        id,
        action,
        entity,
        entity_id,
        details,
        created_at,
        users (
          username,
          email
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching logs:", error.message);
    } else {
      setLogs(data);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Audit Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="6" cellSpacing="0">
          <thead>
            <tr>
              <th>Action</th>
              <th>Entity</th>
              <th>Entity ID</th>
              <th>Details</th>
              <th>User</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.action}</td>
                <td>{log.entity}</td>
                <td>{log.entity_id || "—"}</td>
                <td>
                  <pre>{JSON.stringify(log.details, null, 2)}</pre>
                </td>
                <td>{log.users?.username || log.users?.email || "Unknown"}</td>
                <td>{new Date(log.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
