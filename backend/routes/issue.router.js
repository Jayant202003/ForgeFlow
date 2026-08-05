const express = require("express");
const issueController = require("../controllers/issueController");

const issueRouter = express.Router();

// Create Issue for a Repository
issueRouter.post(
  "/issue/create/:id",
  issueController.createIssue
);

// Get All Issues of a Repository
issueRouter.get(
  "/issue/all/:id",
  issueController.getAllIssues
);

// Get Single Issue
issueRouter.get(
  "/issue/:id",
  issueController.getIssueById
);

// Update Issue
issueRouter.put(
  "/issue/update/:id",
  issueController.updateIssueById
);

// Delete Issue
issueRouter.delete(
  "/issue/delete/:id",
  issueController.deleteIssueById
);

module.exports = issueRouter;