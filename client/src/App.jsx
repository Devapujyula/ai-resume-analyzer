import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);

  // AI result store cheyyataiki
  const [analysis, setAnalysis] = useState(null);
  // UI contro (button disable, text change)
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [jobDesc, setJobDesc] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    // ✅ Check file type
    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed");
      return;
    }

    // ✅ Check file size (2MB)
    if (selectedFile.size > 2 * 1024 * 1024) {
      alert("File size should be less than 2MB");
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("resume", file);
    formData.append("jobDesc", jobDesc);

    try {
      setLoading(true);
      setError("");
      setAnalysis(null);

      const res = await axios.post(
        "https://ai-resume-analyzer-3une.onrender.com/upload",
        formData,
      );

      setAnalysis(res.data.analysis);
    } catch (err) {
      console.log(err);

      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Spinner = () => {
    return (
      <div style={{ marginTop: "20px", color: "blue" }}>
        <p>🔄 Analyzing your resume... Please wait</p>
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "auto",
          background: "#fff",
          borderRadius: "12px",
          padding: "30px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h1 style={{ textAlign: "center" }}>AI Resume Analyzer</h1>

        <input
          type="file"
          onChange={handleFileChange}
          disabled={loading}
          style={{ marginTop: "20px" }}
        />

        <br />
        <br />
        <textarea
          placeholder="Paste Job Description here..."
          value={jobDesc}
          onChange={(e) => setJobDesc(e.target.value)}
          rows={5}
          style={{
            width: "100%",
            marginTop: "20px",
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <p style={{ fontSize: "12px", color: "#888" }}>
          (Optional: Paste job description to get match score)
        </p>
        <button
          onClick={handleUpload}
          disabled={loading}
          style={{
            marginTop: "20px",
            width: "100%",
            padding: "12px",
            background: "#4f46e5",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Analyzing..." : "Upload Resume"}
        </button>

        {!analysis && !loading && (
          <div
            style={{ marginTop: "30px", textAlign: "center", color: "#666" }}
          >
            <p>📄 Upload your resume to get AI analysis</p>
            <p>💡 You can also paste a job description for better results</p>
          </div>
        )}

        {loading && <Spinner />}

        {error && (
          <div
            style={{
              marginTop: "15px",
              padding: "10px",
              background: "#ffe6e6",
              color: "red",
              borderRadius: "6px",
            }}
          >
            ❌ {error}
          </div>
        )}
        {!loading && analysis && (
          <p style={{ color: "green", textAlign: "center", marginTop: "20px" }}>
            ✅ Analysis completed successfully
          </p>
        )}
        {!loading && analysis && (
          <div
            style={{
              marginTop: "30px",
              padding: "25px",
              borderRadius: "12px",
              background: "#f9fafb",
              lineHeight: "1.6",
            }}
          >
            <h2
              style={{
                color: analysis.score > 70 ? "green" : "red",
                textAlign: "center",
              }}
            >
              Score: {analysis.score}/100
            </h2>

            <h3 style={{ textAlign: "center", marginTop: "10px" }}>
              Match Score: {analysis.matchScore}/100
            </h3>

            <hr style={{ margin: "20px 0", border: "0.5px solid #ddd" }} />

            <div style={{ marginTop: "20px" }}>
              <h3>Missing Keywords</h3>
              <ul>
                {analysis.missingKeywords?.map((item, index) => (
                  <li key={index}>🔍 {item}</li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: "20px" }}>
              <h3>Strengths</h3>
              <ul>
                {analysis.strengths?.map((item, index) => (
                  <li key={index}>✅ {item}</li>
                ))}
              </ul>
            </div>

            <hr style={{ margin: "20px 0", border: "0.5px solid #ddd" }} />

            <div style={{ marginTop: "20px" }}>
              <h3>Weaknesses</h3>
              <ul>
                {analysis.weaknesses?.map((item, index) => (
                  <li key={index}>⚠️ {item}</li>
                ))}
              </ul>
            </div>
            <hr style={{ margin: "20px 0", border: "0.5px solid #ddd" }} />

            <div style={{ marginTop: "20px" }}>
              <h3>Missing Skills</h3>
              <ul>
                {analysis.missingSkills?.map((item, index) => (
                  <li key={index}>❌ {item}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
