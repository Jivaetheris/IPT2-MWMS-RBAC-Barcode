import { useEffect, useState } from "react";
import { supabase } from "../../createClient";

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
          email,
          role
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch logs:", error.message);
    } else {
      // Optional: Filter only admin actions
      const adminLogs = data.filter(log => log.users?.role === "admin");
      setLogs(adminLogs);
    }

    setLoading(false);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Admin Audit Logs</h2>
      {loading ? (
        <p>Loading...</p>
      ) : logs.length === 0 ? (
        <p>No admin logs found.</p>
      ) : (
        <div className="overflow-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-200">
              <tr>
                <th className="border p-2">Action</th>
                <th className="border p-2">Entity</th>
                <th className="border p-2">Entity ID</th>
                <th className="border p-2">Details</th>
                <th className="border p-2">Admin</th>
                <th className="border p-2">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-t">
                  <td className="p-2">{log.action}</td>
                  <td className="p-2">{log.entity}</td>
                  <td className="p-2">{log.entity_id || "—"}</td>
                  <td className="p-2 whitespace-pre-wrap max-w-xs break-words">
                    <pre>{JSON.stringify(log.details, null, 2)}</pre>
                  </td>
                  <td className="p-2">
                    {log.users?.username || log.users?.email || "Unknown"}
                  </td>
                  <td className="p-2">
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
