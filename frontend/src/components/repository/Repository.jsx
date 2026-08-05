import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./repository.css";

const Repository = () => {
  const { id } = useParams();

  const userId = localStorage.getItem("userId");

  const [repo, setRepo] = useState(null);

  const [starred, setStarred] = useState(false);
  const [starCount, setStarCount] = useState(0);

  const [fileName, setFileName] = useState("");
  const [fileContent, setFileContent] = useState("");

  const [selectedFile, setSelectedFile] = useState(null);
  const [editedContent, setEditedContent] = useState("");

  useEffect(() => {
    fetchRepository();
    fetchStarStatus();
  }, []);

  const fetchRepository = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3002/repo/${id}`
      );

      setRepo(res.data);

      if (selectedFile) {
        const latest = res.data.files.find(
          (file) => file._id === selectedFile._id
        );

        if (latest) {
          setSelectedFile(latest);
          setEditedContent(latest.content);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStarStatus = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3002/repo/star/${id}/${userId}`
      );

      setStarred(res.data.starred);
      setStarCount(res.data.stars);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStar = async () => {
    try {
      const res = await axios.patch(
        `http://localhost:3002/repo/star/${id}`,
        {
          userId,
        }
      );

      setStarred(res.data.starred);
      setStarCount(res.data.stars);
    } catch (err) {
      console.error(err);
    }
  };
    const createFile = async () => {
    if (!fileName.trim()) return;

    try {
      await axios.post(
        `http://localhost:3002/repo/${id}/file`,
        {
          name: fileName,
          content: fileContent,
        }
      );

      setFileName("");
      setFileContent("");

      fetchRepository();
    } catch (err) {
      console.error(err);
    }
  };

  const updateFile = async () => {
    if (!selectedFile) return;

    try {
      await axios.put(
        `http://localhost:3002/repo/${id}/file/${selectedFile._id}`,
        {
          content: editedContent,
        }
      );

      alert("File saved successfully!");

      fetchRepository();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteFile = async () => {
    if (!selectedFile) return;

    if (!window.confirm("Delete this file?")) return;

    try {
      await axios.delete(
        `http://localhost:3002/repo/${id}/file/${selectedFile._id}`
      );

      setSelectedFile(null);

      fetchRepository();
    } catch (err) {
      console.error(err);
    }
  };

  if (!repo) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: "40px" }}>Loading...</h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="repository-page">

        <div className="repo-header">

          <div>
            <h1>{repo.name}</h1>
            <p>{repo.description}</p>
          </div>

          <button
            className={starred ? "star-btn starred" : "star-btn"}
            onClick={toggleStar}
          >
            {starred ? "⭐ Starred" : "☆ Star"}

            <span className="star-count">
              {starCount}
            </span>
          </button>

        </div>
        <div className="repo-tabs">
  <Link
    to={`/repo/${id}`}
    className="active-tab"
  >
    Code
  </Link>

  <Link
    to={`/repo/${id}/issues`}
    className="tab"
  >
    Issues ({repo.issues?.length || 0})
  </Link>
</div>

        <div className="new-file">

          <h2>Create File</h2>

          <input
            type="text"
            placeholder="README.md"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
          />

          <textarea
            rows="8"
            placeholder="Write your code..."
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          />

          <button onClick={createFile}>
            Create File
          </button>

        </div>

        <div className="files-section">

          <h2>Files</h2>

          {repo.files.length === 0 ? (
            <p>No files available.</p>
          ) : (
            repo.files.map((file) => (
              <div
                key={file._id}
                className="file-card"
                onClick={() => {
                  setSelectedFile(file);
                  setEditedContent(file.content);
                }}
              >
                📄 {file.name}
              </div>
            ))
          )}

        </div>
                {selectedFile && (

          <div className="file-viewer">

            <h2>{selectedFile.name}</h2>

            <textarea
              rows="18"
              value={editedContent}
              onChange={(e) =>
                setEditedContent(e.target.value)
              }
            />

            <div className="viewer-buttons">

              <button
                className="save-btn"
                onClick={updateFile}
              >
                💾 Save
              </button>

              <button
                className="delete-btn"
                onClick={deleteFile}
              >
                🗑 Delete
              </button>

            </div>

          </div>

        )}

        <div className="repository-info">

          <h3>Repository Information</h3>

          <div className="repo-details">

            <p>
              <strong>Visibility:</strong>{" "}
              {repo.visibility ? "🌍 Public" : "🔒 Private"}
            </p>

            <p>
              <strong>Repository ID:</strong>
            </p>

            <code>{repo._id}</code>

            <p style={{ marginTop: "20px" }}>
              <strong>Owner:</strong>{" "}
              {repo.owner?.username || "Unknown"}
            </p>

            <p>
              <strong>Total Files:</strong>{" "}
              {repo.files ? repo.files.length : 0}
            </p>

            <p>
              <strong>Total Issues:</strong>{" "}
              {repo.issues ? repo.issues.length : 0}
            </p>

            <p>
              <strong>Stars:</strong>{" "}
              {starCount}
            </p>

          </div>

        </div>

      </div>
          </>
  );
};

export default Repository;