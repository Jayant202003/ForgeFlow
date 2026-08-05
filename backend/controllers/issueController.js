const Repository = require("../models/repoModel");
const Issue = require("../models/issueModel");

// CREATE ISSUE
async function createIssue(req, res) {
  const { id } = req.params;
  const { title, description } = req.body;

  try {
    const repository = await Repository.findById(id);

    if (!repository) {
      return res.status(404).json({
        error: "Repository not found!",
      });
    }

    const issue = new Issue({
      title,
      description,
      repository: id,
    });

    await issue.save();

    repository.issues.push(issue._id);
    await repository.save();

    res.status(201).json({
      message: "Issue created successfully!",
      issue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
}

// GET ALL ISSUES OF REPOSITORY
async function getAllIssues(req, res) {
  const { id } = req.params;

  try {
    const issues = await Issue.find({
      repository: id,
    });

    res.json(issues);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
}

// GET SINGLE ISSUE
async function getIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        error: "Issue not found!",
      });
    }

    res.json(issue);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
}

// UPDATE ISSUE
async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;

  try {
    const issue = await Issue.findById(id);

    if (!issue) {
      return res.status(404).json({
        error: "Issue not found!",
      });
    }

    if (title) issue.title = title;
    if (description) issue.description = description;
    if (status) issue.status = status;

    await issue.save();

    res.json({
      message: "Issue updated successfully!",
      issue,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
}

// DELETE ISSUE
async function deleteIssueById(req, res) {
  const { id } = req.params;

  try {
    const issue = await Issue.findByIdAndDelete(id);

    if (!issue) {
      return res.status(404).json({
        error: "Issue not found!",
      });
    }

    await Repository.updateOne(
      { _id: issue.repository },
      {
        $pull: {
          issues: issue._id,
        },
      }
    );

    res.json({
      message: "Issue deleted successfully!",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Server Error",
    });
  }
}

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};