import React, { useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append('logfile', file);

    try {
      const res = await axios.post('http://localhost:5000/analyze', formData);
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert("Error connecting to backend");
    }
  };

  // 🔹 Step 2c: Prepare chart data (outside JSX)
  const chartData = result ? [
    { name: "Errors", value: result.errorCount },
    { name: "Warnings", value: result.warningCount },
    { name: "CTM Errors", value: result.ctmErrorCount },
  ] : [];

  const COLORS = ["#FF4C4C", "#FFA500", "#FF0000"];

  return (
    <div style={{ maxWidth: "900px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: "#f5f5f5",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
      <h2>Control-M Log Analyzer</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} 
	  style={{
    padding: "8px 12px",
    borderRadius: "5px",
    border: "1px solid #ccc"
}}/>
      <br /><br />

      <button onClick={uploadFile} style={{
    marginLeft: "10px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontWeight: "bold"
}}>Analyze</button>

      {result && (
  <div style={{ marginTop: 20 }}>
      <h3>Summary:</h3>
    <p>Total Lines: {result.totalLines}</p>
    <p>Errors: {result.errorCount}</p>
    <p>Warnings: {result.warningCount}</p>
    <p>Job Failures: {result.jobFailureCount}</p>
    <p>CTM Errors: {result.ctmErrorCount}</p>

    {/* 🔥 Error Table */}
    <h3 style={{ marginTop: 20 }}>CTM Error Details</h3>

    <table border="1" cellPadding="10" style={{ borderCollapse: "collapse", width: "100%" }}>
      <thead>
        <tr>
          <th>Line</th>
          <th>Log Message</th>
        </tr>
      </thead>
      <tbody>
        {result.ctmErrors.map((err, index) => (
          <tr key={index}>
            <td>{err.line}</td>
            <td style={{ color: "red", fontWeight: "bold" }}>
              {err.text.split("ERROR").map((part, i, arr) => (
  <>
    {part}
    {i < arr.length - 1 && <span style={{ color: "red" }}>ERROR</span>}
  </>
))}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
	{/* 🔹 Step B: Charts */}
<div style={{ marginTop: 30 }}>
  <h3>Charts:</h3>
  <PieChart width={400} height={300}>
    <Pie
      data={chartData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      fill="#8884d8"
      label
    >
      {chartData.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend />
  </PieChart>

  <BarChart width={500} height={300} data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar dataKey="value" fill="#82ca9d" />
  </BarChart>
  </div>
  
  {/* AI Root Cause Suggestions */}
<div style={{ marginTop: 30,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: "8px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)" }}>
	
  <h3>AI Root Cause Suggestions:</h3>
  <ul style={{ marginLeft: "20px" }}>
    {result.ctmErrors.some(err => err.text.includes("DisplayConnectionError")) && (
      <li>Connection issue detected → Check Control-M Server / CCM Framework connection settings</li>
    )}

    {result.jobFailures.length > 0 && (
      <li>Job failure detected → Review job logs & dependencies</li>
    )}

    {result.warningCount > 0 && (
      <li>Warnings detected → Check disk space / system resources</li>
    )}
  </ul>
</div>

</div>
)}
    </div>
  );
	  }

export default App;