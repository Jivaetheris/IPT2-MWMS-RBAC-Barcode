import { useEffect, useState } from "react";
import { supabase } from "../../createClient";

export default function Report() {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from("stock_entries")
        .select(`
          product_id,
          warehouse_id,
          quantity,
          product:products(name),
          warehouse:warehouses(name)
        `);

      if (!error) {
        const grouped = {};

        data.forEach((entry) => {
          const key = `${entry.product_id}_${entry.warehouse_id}`;
          if (!grouped[key]) {
            grouped[key] = {
              product: entry.product.name,
              warehouse: entry.warehouse.name,
              total: 0,
            };
          }
          grouped[key].total += entry.quantity;
        });

        setReportData(Object.values(grouped));
      }
    };

    fetchReport();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Inventory Report</h2>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "15px" }}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Warehouse</th>
            <th style={thStyle}>Total Quantity</th>
          </tr>
        </thead>
        <tbody>
          {reportData.map((row, idx) => (
            <tr key={idx}>
              <td style={tdStyle}>{row.product}</td>
              <td style={tdStyle}>{row.warehouse}</td>
              <td style={tdStyle}>{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f4f4f4",
  textAlign: "left",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
};
