import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./IssuePage.css";

const IssuePage = () => {
  const { id } = useParams();

  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    await Promise.all([fetchRepository(), fetchIssues()]);
  };

  const fetchRepository = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3002/repo/${id}`
      );

      setRepo(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3002/issue/all/${id}`
      );

      setIssues(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const createIssue = async () => {
    if (!title.trim()) {
      alert("Issue title is required.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3002/issue/create/${id}`,
        {
          title,
          description,
        }
      );

      setTitle("");
      setDescription("");

      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateIssue = async (issue) => {
    try {
      await axios.put(
        `http://localhost:3002/issue/update/${issue._id}`,
        {
          title: issue.title,
          description: issue.description,
          status:
            issue.status === "open"
              ? "closed"
              : "open",
        }
      );

      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const deleteIssue = async (issueId) => {
    if (!window.confirm("Delete this issue?")) return;

    try {
      await axios.delete(
        `http://localhost:3002/issue/delete/${issueId}`
      );

      loadData();
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

      <div className="issue-page">

        <div className="issue-header">

          <h1>{repo.name}</h1>

          <div className="repo-tabs">
            <Link to={`/repo/${id}`}>
              Code
            </Link>

            <span className="active-tab">
              Issues ({issues.length})
            </span>
          </div>

        </div>

        <div className="create-issue">

          <h2>Create New Issue</h2>

          <input
            type="text"
            placeholder="Issue title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            rows="5"
            placeholder="Describe the issue..."
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
          />

          <button onClick={createIssue}>
            Create Issue
          </button>

        </div>

        <div className="issues-list">

          <h2>Repository Issues</h2>

          {issues.length === 0 ? (
            <p>No issues found.</p>
          ) : (
            issues.map((issue) => (
              <div
                className="issue-card"
                key={issue._id}
              >
                <div className="issue-info">

                  <h3>🐛 {issue.title}</h3>

                  <p>{issue.description}</p>

                  <span
                    className={
                      issue.status === "open"
                        ? "status-open"
                        : "status-closed"
                    }
                  >
                    {issue.status}
                  </span>

                </div>

                <div className="issue-actions">

                  <button
                    className="toggle-btn"
                    onClick={() =>
                      updateIssue(issue)
                    }
                  >
                    {issue.status === "open"
                      ? "Close"
                      : "Reopen"}
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteIssue(issue._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

      </div>
    </>
  );
};

export default IssuePage;