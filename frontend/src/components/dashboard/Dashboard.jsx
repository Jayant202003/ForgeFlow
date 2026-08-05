import React, { useState, useEffect } from "react";
import "./dashboard.css";
import Navbar from "../Navbar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API_BASE_URL from "../../config/api";

const Dashboard = () => {
  const navigate = useNavigate();

  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/repo/user/${userId}`);

        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/repo/all`);
        const data = await response.json();

        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      setSearchResults(
        repositories.filter((repo) =>
          repo.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, repositories]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this repository?"
    );

    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:3002/repo/delete/${id}`);

      const updatedRepos = repositories.filter((repo) => repo._id !== id);

      setRepositories(updatedRepos);
      setSearchResults(updatedRepos);

      setSuggestedRepositories((prev) =>
        prev.filter((repo) => repo._id !== id)
      );

      alert("Repository deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete repository.");
    }
  };

  const publicRepos = repositories.filter((r) => r.visibility).length;
  const privateRepos = repositories.length - publicRepos;

  return (
    <>
      <Navbar />

      <section id="dashboard">
        <div className="dashboard-header">
          <h1>👋 Welcome Back</h1>
          <p>
            Manage your repositories, discover projects and organize your
            development workflow.
          </p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <h2>{repositories.length}</h2>
            <p>Total Repositories</p>
          </div>

          <div className="stat-card">
            <h2>{publicRepos}</h2>
            <p>Public</p>
          </div>

          <div className="stat-card">
            <h2>{privateRepos}</h2>
            <p>Private</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <aside className="sidebar">
            <div className="sidebar-card">
              <h3>Suggested Projects</h3>

              {suggestedRepositories.length === 0 ? (
                <p style={{ color: "#8b949e" }}>No repositories found.</p>
              ) : (
                suggestedRepositories.map((repo) => (
                  <div
                    className="suggestion-card"
                    key={repo._id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/repo/${repo._id}`)}
                  >
                    <h4>{repo.name}</h4>
                    <p>{repo.description}</p>
                  </div>
                ))
              )}
            </div>

            <div className="sidebar-card">
              <h3>Upcoming Events</h3>

              <div className="event">🚀 Tech Conference — Dec 15</div>
              <div className="event">💻 Developer Meetup — Dec 25</div>
              <div className="event">⚛ React Summit — Jan 5</div>
            </div>
          </aside>

          <main className="main-panel">
            <h2>Your Repositories</h2>

            <div className="search-box">
              <input
                type="text"
                placeholder="Search repository..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {searchResults.length === 0 ? (
              <p style={{ color: "#8b949e" }}>No repositories found.</p>
            ) : (
              searchResults.map((repo) => (
                <div
                  className="repo-card"
                  key={repo._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  <h3>📦 {repo.name}</h3>

                  <p>{repo.description}</p>

                  <div className="repo-footer">
                    <span className="visibility">
                      {repo.visibility ? "🌍 Public" : "🔒 Private"}
                    </span>

                    <div
                      className="actions"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/edit/${repo._id}`)}
                      >
                        Edit
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(repo._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </main>
        </div>
      </section>
    </>
  );
};

export default Dashboard;