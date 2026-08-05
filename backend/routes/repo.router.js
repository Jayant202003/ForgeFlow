const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post(
  "/repo/create",
  repoController.createRepository
);

repoRouter.get(
  "/repo/all",
  repoController.getAllRepositories
);

repoRouter.get(
  "/repo/:id",
  repoController.fetchRepositoryById
);

repoRouter.get(
  "/repo/name/:name",
  repoController.fetchRepositoryByName
);
repoRouter.get(
  "/repo/user/:userID",
  repoController.fetchRepositoriesForCurrentUser
);

repoRouter.put(
  "/repo/update/:id",
  repoController.updateRepositoryById
);

repoRouter.delete(
  "/repo/delete/:id",
  repoController.deleteRepositoryById
);

repoRouter.patch(
  "/repo/toggle/:id",
  repoController.toggleVisibilityById
);

// --------------------
// FILE ROUTES
// --------------------

repoRouter.post(
  "/repo/:id/file",
  repoController.addFile
);

repoRouter.put(
  "/repo/:id/file/:fileId",
  repoController.updateFile
);
repoRouter.delete(
  "/repo/:id/file/:fileId",
  repoController.deleteFile
);

// --------------------
// STAR ROUTES
// --------------------

repoRouter.patch(
  "/repo/star/:id",
  repoController.toggleStarRepository
);

repoRouter.get(
  "/repo/star/:id/:userId",
  repoController.checkStarStatus
);
module.exports = repoRouter;