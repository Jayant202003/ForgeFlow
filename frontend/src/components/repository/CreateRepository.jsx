import React, { useState, useEffect } from "react";
import axios from "axios";
import API_BASE_URL from "../../config/api";
import { useNavigate, useParams } from "react-router-dom";
import "./createRepository.css";

const CreateRepository = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const isEdit = !!id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);

  const owner = localStorage.getItem("userId");

  useEffect(() => {
    if (!isEdit) return;

    const fetchRepository = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/repo/${id}`
        );

        setName(res.data.name);
        setDescription(res.data.description || "");
        setVisibility(res.data.visibility);
      } catch (err) {
        console.error(err);
        alert("Unable to load repository.");
      }
    };

    fetchRepository();
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      return alert("Repository name is required.");
    }

    try {
      setLoading(true);

      if (isEdit) {
        await axios.put(
          `${API_BASE_URL}/repo/update/${id}`,
          {
            name,
            description,
            visibility,
          }
        );

        alert("Repository updated successfully!");
      } else {
        await axios.post(
          `${API_BASE_URL}/repo/create",
          {
            owner,
            name,
            description,
            visibility,
            content: [],
            issues: [],
          }
        );

        alert("Repository created successfully!");
      }

      navigate("/");
    } catch (err) {
      console.error(err);
      alert(isEdit ? "Update failed." : "Creation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-repo-page">
      <div className="create-repo-card">

        <h1>
          {isEdit ? "Edit Repository" : "Create Repository"}
        </h1>

        <p>
          {isEdit
            ? "Update your repository."
            : "Create a new repository in ForgeFlow."}
        </p>

        <form onSubmit={handleSubmit}>

          <label>Repository Name</label>

          <input
            type="text"
            placeholder="Repository Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <label>Description</label>

          <textarea
            rows="5"
            placeholder="Repository Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Visibility</label>

          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value === "true")}
          >
            <option value={true}>🌍 Public</option>
            <option value={false}>🔒 Private</option>
          </select>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Saving..."
              : isEdit
              ? "Update Repository"
              : "Create Repository"}
          </button>

        </form>

      </div>
    </div>
  );
};

export default CreateRepository;