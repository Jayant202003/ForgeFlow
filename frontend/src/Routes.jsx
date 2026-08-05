import React, { useEffect } from "react";
import { useNavigate, useRoutes } from "react-router-dom";

import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import CreateRepository from "./components/repository/CreateRepository";
import Repository from "./components/repository/Repository";
import IssuePage from "./components/issues/IssuePage";

import { useAuth } from "./authContext";

const ProjectRoutes = () => {
  const { currentUser, setCurrentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    if (userId && !currentUser) {
      setCurrentUser(userId);
    }

    const publicRoutes = ["/auth", "/signup"];

    if (!userId && !publicRoutes.includes(window.location.pathname)) {
      navigate("/auth", { replace: true });
    }

    if (userId && window.location.pathname === "/auth") {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate, setCurrentUser]);

  return useRoutes([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/auth",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/profile",
      element: <Profile />,
    },
    {
      path: "/create",
      element: <CreateRepository />,
    },
    {
      path: "/edit/:id",
      element: <CreateRepository />,
    },
    {
      path: "/repo/:id",
      element: <Repository />,
    },
    {
      path: "/repo/:id/issues",
      element: <IssuePage />,
    },
  ]);
};

export default ProjectRoutes;