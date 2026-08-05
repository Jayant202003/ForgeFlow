import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const [repositories, setRepositories] = useState([]);
  const [filteredRepos, setFilteredRepos] = useState([]);

  useEffect(() => {
    fetchRepositories();
  }, []);

  const fetchRepositories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3002/repo/all"
      );

      setRepositories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!search.trim()) {
      setFilteredRepos([]);
      return;
    }

    const results = repositories.filter((repo) =>
      repo.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    setFilteredRepos(results);
  }, [search, repositories]);

  return (
    <nav className="navbar">

      <Link to="/" className="logo-section">
        <img
          src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
          alt="GitHub Logo"
        />

        <h3>ForgeFlow</h3>
      </Link>

      <div className="search-wrapper">

        <input
          type="text"
          placeholder="Search repositories..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        {filteredRepos.length > 0 && (
          <div className="search-dropdown">

            {filteredRepos.map((repo) => (
              <Link
                key={repo._id}
                to={`/repo/${repo._id}`}
                className="search-item"
                onClick={() => {
                  setSearch("");
                  setFilteredRepos([]);
                }}
              >
                📁 {repo.name}
              </Link>
            ))}

          </div>
        )}

      </div>

      <div className="nav-links">

        <Link to="/create">
          <p>New Repository</p>
        </Link>

        <Link to="/profile">
          <p>My Profile</p>
        </Link>

      </div>

    </nav>
  );
};

export default Navbar;