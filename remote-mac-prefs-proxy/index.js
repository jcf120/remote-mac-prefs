const path = require("path");
const express = require("express");
const proxy = require("express-http-proxy");

const port = 3000;
const app = express();

app.post("/graphql", proxy("http://localhost:4000"));
app.use(
  "/",
  express.static(path.join(__dirname, "../remote-mac-prefs-frontend/build"))
);

app.listen(port, () => {
  console.log(`Remote mac prefs proxy listening at http://localhost:${port}`);
});
