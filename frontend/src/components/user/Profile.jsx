import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./profile.css";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const Profile = () => {
  const { setCurrentUser } = useAuth();

  const userId = localStorage.getItem("userId");

  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);

  useEffect(() => {
    fetchProfile();
    fetchRepositories();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3002/userProfile/${userId}`
      );

      setUser(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRepositories = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3002/repo/user/${userId}`
      );

      setRepositories(res.data.repositories || []);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <h2 style={{ padding: "40px", color: "white" }}>
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="profile-container">

        <div className="profile-sidebar">

          <div className="avatar">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <h1>{user.username}</h1>

          <p>{user.email}</p>

          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

          <div className="stats">

            <div className="stat-card">
              <h2>{repositories.length}</h2>
              <span>Repositories</span>
            </div>

            <div className="stat-card">
              <h2>
                {user.starRepos?.length || 0}
              </h2>
              <span>Stars</span>
            </div>

            <div className="stat-card">
              <h2>
                {user.followedUsers?.length || 0}
              </h2>
              <span>Following</span>
            </div>

          </div>

        </div>

        <div className="profile-content">

          <HeatMapProfile />

          <h2 className="repo-heading">
            Your Repositories
          </h2>
                    {repositories.length === 0 ? (
            <div className="empty-repo">
              <h3>No repositories yet.</h3>
              <p>Create your first repository from the dashboard.</p>
            </div>
          ) : (
            <div className="repo-grid">
              {repositories.map((repo) => (
                <Link
                  key={repo._id}
                  to={`/repo/${repo._id}`}
                  className="repo-card"
                >
                  <div className="repo-card-top">
                    <h3>{repo.name}</h3>

                    <span
                      className={
                        repo.visibility
                          ? "public-badge"
                          : "private-badge"
                      }
                    >
                      {repo.visibility ? "Public" : "Private"}
                    </span>
                  </div>

                  <p className="repo-description">
                    {repo.description ||
                      "No description provided."}
                  </p>

                  <div className="repo-footer">
                    <span>
                      📄 {repo.files?.length || 0} Files
                    </span>

                    <span>
                      🐞 {repo.issues?.length || 0} Issues
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="heatmap-wrapper">
            <h2 className="repo-heading">
              Contribution Activity
            </h2>

            <HeatMapProfile />
          </div>

        </div>

      </div>
    </>
  );
};

export default Profile;