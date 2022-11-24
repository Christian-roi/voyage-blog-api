const express = require("express");
const postsRouter = require("./routes/posts");
const commentsRouter = require("./routes/comments");
const connect = require("./schemas");

connect();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use("/", [postsRouter], [commentsRouter]);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
