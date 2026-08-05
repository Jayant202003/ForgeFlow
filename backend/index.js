const dns = require("dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const path = require("path");
const fs = require("fs");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");

const mainRouter = require("./routes/main.router");

const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");

dotenv.config();

/* ---------------- CLI COMMANDS ---------------- */

yargs(hideBin(process.argv))
  .command("start", "Starts ForgeFlow server", {}, startServer)

  .command("init", "Initialise a new repository", {}, initRepo)

  .command(
    "add <file>",
    "Add file to staging area",
    (yargs) => {
      yargs.positional("file", {
        describe: "File to stage",
        type: "string",
      });
    },
    (argv) => addRepo(argv.file)
  )

  .command(
    "commit <message>",
    "Commit staged files",
    (yargs) => {
      yargs.positional("message", {
        describe: "Commit message",
        type: "string",
      });
    },
    (argv) => commitRepo(argv.message)
  )

  .command("push", "Push commits to S3", {}, pushRepo)

  .command("pull", "Pull commits from S3", {}, pullRepo)

  .command(
    "revert <commitID>",
    "Revert repository",
    (yargs) => {
      yargs.positional("commitID", {
        describe: "Commit ID",
        type: "string",
      });
    },
    (argv) => revertRepo(argv.commitID)
  )

  .demandCommand(1)
  .help().argv;

/* ---------------- SERVER ---------------- */

function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  // Middlewares
  app.use(cors({ origin: "*" }));
  app.use(bodyParser.json());
  app.use(express.json());

  // MongoDB
  mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("✅ MongoDB connected!"))
    .catch((err) => console.error("MongoDB Error:", err));

  mongoose.connection.once("open", () => {
    console.log("CRUD operations called");
  });

  // API Routes
  app.use("/", mainRouter);

  // ---------------- SERVE REACT ----------------

  const frontendPath = path.join(__dirname, "../frontend/dist");

  if (fs.existsSync(frontendPath)) {
    console.log("Serving React build from:", frontendPath);

    app.use(express.static(frontendPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(frontendPath, "index.html"));
    });
  } else {
    console.log("Frontend build not found.");
  }

  // ---------------- SOCKET.IO ----------------

  const httpServer = http.createServer(app);

  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("User Connected");

    socket.on("joinRoom", (userID) => {
      socket.join(userID);
      console.log(`Joined Room: ${userID}`);
    });

    socket.on("disconnect", () => {
      console.log("User Disconnected");
    });
  });

  // ---------------- START SERVER ----------------

  httpServer.listen(port, () => {
    console.log(`🚀 ForgeFlow running on PORT ${port}`);
  });
}