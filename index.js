require("dotenv").config()
const app = require("./app/app");






app.listen(process.env.PORT, ()=> console.log("app working on " + process.env.PORT))