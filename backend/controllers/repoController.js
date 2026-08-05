const mongoose = require("mongoose");
const Repository = require("../models/repoModel");
const User = require("../models/userModel");

// ==============================
// CREATE REPOSITORY
// ==============================

async function createRepository(req, res) {
  const {
    owner,
    name,
    issues,
    content,
    description,
    visibility,
  } = req.body;

  try {
    if (!name) {
      return res.status(400).json({
        error: "Repository name is required!",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(owner)) {
      return res.status(400).json({
        error: "Invalid User ID!",
      });
    }

    const newRepository = new Repository({
      owner,
      name,
      description,
      visibility,
      content: content || [],
      issues: issues || [],
    });

    const repository = await newRepository.save();

    await User.findByIdAndUpdate(owner, {
      $push: {
        repositories: repository._id,
      },
    });

    res.status(201).json({
      message: "Repository created successfully!",
      repositoryID: repository._id,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// GET ALL REPOSITORIES
// ==============================

async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find({})
      .populate("owner")
      .populate("issues");

    res.status(200).json(repositories);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// GET REPOSITORY BY ID
// ==============================

async function fetchRepositoryById(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Repository ID",
      });
    }

    const repository = await Repository.findById(id)
      .populate("owner")
      .populate("issues");

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    res.status(200).json(repository);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}
// ==============================
// GET REPOSITORY BY NAME
// ==============================

async function fetchRepositoryByName(req, res) {
  const { name } = req.params;

  try {
    const repositories = await Repository.find({ name })
      .populate("owner")
      .populate("issues");

    res.status(200).json(repositories);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// GET USER REPOSITORIES
// ==============================

async function fetchRepositoriesForCurrentUser(req, res) {
  const { userID } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(userID)) {
      return res.status(400).json({
        message: "Invalid User ID",
      });
    }

    const repositories = await Repository.find({
      owner: userID,
    });

    res.status(200).json({
      message: "Repositories fetched successfully.",
      repositories: repositories || [],
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
    });
  }
}

// ==============================
// UPDATE REPOSITORY
// ==============================

async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const {
    name,
    description,
    visibility,
    content,
  } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    if (name !== undefined) {
      repository.name = name;
    }

    if (description !== undefined) {
      repository.description = description;
    }

    if (visibility !== undefined) {
      repository.visibility = visibility;
    }

    if (content !== undefined) {
      repository.content = content;
    }

    const updatedRepository = await repository.save();

    res.status(200).json({
      message: "Repository updated successfully!",
      repository: updatedRepository,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// TOGGLE VISIBILITY
// ==============================

async function toggleVisibilityById(req, res) {
  const { id } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    repository.visibility = !repository.visibility;

    await repository.save();

    res.status(200).json({
      message: "Visibility updated successfully!",
      repository,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}
// ==============================
// DELETE REPOSITORY
// ==============================

async function deleteRepositoryById(req, res) {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: "Invalid Repository ID",
      });
    }

    const repository = await Repository.findByIdAndDelete(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    await User.findByIdAndUpdate(repository.owner, {
      $pull: {
        repositories: repository._id,
      },
    });

    res.status(200).json({
      message: "Repository deleted successfully!",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// ADD FILE
// ==============================

async function addFile(req, res) {
  const { id } = req.params;
  const { name, content } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    repository.files.push({
      name,
      content,
    });

    await repository.save();

    res.status(201).json({
      message: "File added successfully!",
      files: repository.files,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// UPDATE FILE
// ==============================

async function updateFile(req, res) {
  const { id, fileId } = req.params;
  const { content } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    const file = repository.files.id(fileId);

    if (!file) {
      return res.status(404).json({
        error: "File not found!",
      });
    }

    file.content = content;

    await repository.save();

    res.status(200).json({
      message: "File updated successfully!",
      file,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// DELETE FILE
// ==============================

async function deleteFile(req, res) {
  const { id, fileId } = req.params;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    repository.files.pull(fileId);

    await repository.save();

    res.status(200).json({
      message: "File deleted successfully!",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}
// ==============================
// TOGGLE STAR REPOSITORY
// ==============================

async function toggleStarRepository(req, res) {
  const { id } = req.params;
  const { userId } = req.body;

  try {
    const repository = await Repository.findById(id);
    const user = await User.findById(userId);

    if (!repository || !user) {
      return res.status(404).json({
        error: "Repository or User not found!",
      });
    }

    const alreadyStarred = user.starRepos.some(
      (repoId) => repoId.toString() === id
    );

    if (alreadyStarred) {
      user.starRepos.pull(id);
      repository.stars = Math.max((repository.stars || 1) - 1, 0);

      await user.save();
      await repository.save();

      return res.status(200).json({
        starred: false,
        stars: repository.stars,
      });
    }

    user.starRepos.push(id);
    repository.stars = (repository.stars || 0) + 1;

    await user.save();
    await repository.save();

    res.status(200).json({
      starred: true,
      stars: repository.stars,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// CHECK STAR STATUS
// ==============================

async function checkStarStatus(req, res) {
  const { id, userId } = req.params;

  try {
    const repository = await Repository.findById(id);
    const user = await User.findById(userId);

    if (!repository || !user) {
      return res.status(404).json({
        error: "Repository or User not found!",
      });
    }

    const starred = user.starRepos.some(
      (repoId) => repoId.toString() === id
    );

    res.status(200).json({
      starred,
      stars: repository.stars || 0,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
}

// ==============================
// EXPORTS
// ==============================

module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,

  addFile,
  updateFile,
  deleteFile,

  toggleStarRepository,
  checkStarStatus,
};