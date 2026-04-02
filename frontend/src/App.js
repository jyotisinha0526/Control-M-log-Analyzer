import React, { useState } from "react";
import axios from "axios";

function App() {

	const [query, setQuery] = useState("");
	const [result, setResult] = useState(null);
	
	  // 🔥 👉 YAHAN LIKHNA HAI (STEP 4)
  const sendQuery = async () => {
    if (!query) {
      alert("Please enter a query");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/ai", {
        query: query
      });

      setResult({
		aiText: res.data.aiText
		});

    } catch (err) {
      console.error(err);
      alert("AI request failed");
    }
  }

  return (
  <div
  style={{
    background: "#0B0F19",
    minHeight: "100vh",
    color: "#fff",
    padding: "30px",
    fontFamily: "Segoe UI, sans-serif"
  }}
>

  {/* 🔹 HEADER */}
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 30
  }}>
    <h2 style={{ color: "#4FC3F7" }}>Control-M Assistance</h2>

    <div>
      <button style={{ marginRight: 10 }}>Upload Files</button>
      <button>Logout</button>
    </div>
  </div>

  {/* 🔹 ASK QUESTION CARD */}
  <div style={{
    background: "#111827",
    padding: 25,
    borderRadius: 15,
    marginBottom: 30
  }}>
    <h3 style={{ color: "#4FC3F7" }}>💬 Ask Your Question</h3>

    <textarea
		value={query}
		onChange={(e) => setQuery(e.target.value)}
		placeholder="Describe your Control-M issue..."
	style={{
      width: "100%",
      height: 120,
      marginTop: 15,
      padding: 10,
      borderRadius: 10,
      border: "1px solid #333",
      background: "#0B0F19",
      color: "#fff"
    }}
  />

    <div style={{ marginTop: 20, display: "flex", gap: 15 }}>
      <button onClick={sendQuery}
        style={{
          background: "linear-gradient(90deg, #00C6FF, #0072FF)",
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          color: "#fff"
        }}
      >
        Send Query
      </button>

      <button
        style={{
          background: "linear-gradient(90deg, #8E2DE2, #4A00E0)",
          padding: "10px 20px",
          borderRadius: 8,
          border: "none",
          color: "#fff"
        }}
      >
        Share Screen for AI Analysis
      </button>
    </div>
  </div>

  {/* 🔹 AI RESPONSE CARD */}
  <div style={{
    background: "#111827",
    padding: 25,
    borderRadius: 15
  }}>
    <h3 style={{ color: "#4FC3F7" }}>📂 AI Response</h3>
	{/* 🔍 BMC Search Link */}
<a
  href={`https://webapps.bmc.com/helixsupport/assets/search.html#q=${encodeURIComponent(query)}`}
  target="_blank"
  rel="noreferrer"
  style={{
    color: "#38BDF8",
    display: "block",
    marginBottom: 15,
    textDecoration: "none",
    fontSize: "14px"
  }}
>
  🔍 View related BMC articles
</a>
	<div
		style={{
			marginTop: 15,
			background: "#1E293B",
			padding: 20,
			borderRadius: 10,
			fontFamily: "monospace",
			whiteSpace: "pre-wrap",
			lineHeight: 1.8,
		border: "1px solid #334155"
  }}
>
  {result?.aiText?.split("\n").map((line, i) => {
    const cleanLine = line.trim();
	return(
	<p
      key={i}
      style={{
        marginBottom: 10,
		fontSize: cleanLine.startsWith("##") ? "20px" : "15px",
        fontWeight: cleanLine.startsWith("##") ? "600" : "400",
        color: cleanLine.includes("Solution")
            ? "#22c55e"
            : cleanLine.startsWith("##")
            ? "#38BDF8"
            : "#E2E8F0"
      }}
    >
      {cleanLine}
    </p>
	);
  })}
</div>
  </div>

</div>
    )
}

export default App;