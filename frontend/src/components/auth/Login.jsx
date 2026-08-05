import React, { useState } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../../authContext";

import { PageHeader } from "@primer/react/drafts";
import { Box, Button } from "@primer/react";

import "./auth.css";
import logo from "../../assets/github-mark-white.svg";

const Login = () => {
  const navigate = useNavigate();

  const { setCurrentUser } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE_URL}/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrentUser(res.data.userId);

      navigate("/");
    } catch (error) {
      console.error("Login Error:", error);

      alert("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="ForgeFlow Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <Box sx={{ padding: 1 }}>
            <PageHeader>
              <PageHeader.TitleArea variant="large">
                <PageHeader.Title>
                  Sign in to ForgeFlow
                </PageHeader.Title>
              </PageHeader.TitleArea>
            </PageHeader>
          </Box>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Email address</label>

            <input
              className="input"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="label">Password</label>

            <input
              className="input"
              type="password"
              autoComplete="off"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleLogin}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            New to ForgeFlow?{" "}
            <Link to="/signup">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;