const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: `./config.env` });

const port = process.env.PORT || 3000;

mongoose.connect("mongodb://127.0.0.1:27017/portfolio").then(() => {
  console.log(`connecction successful`);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
