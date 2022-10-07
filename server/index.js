const express = require("express");
const mongoose = require("mongoose");

const app = express();
const port = 5000;

/* config */
const config = require("./config/dev.js");

app.use("/image", express.static("./image"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {

    mongoose.connect(config.mongoURI).then(() => {

        console.log(`Reservation Viewer app listening at http://localhost:${port}`);
        console.log("Connecting MongoDB...");

    }).catch((err) => {

        console.log(`${err}`);

    })

})

/* 
    Router
    /api/ .. 
    ex) /api/user : user에 관련된 router 
*/
app.use("/api/post", require("./Router/post.js"));
app.use("/api/info", require("./Router/info.js"));
app.use("/api/reserve", require("./Router/reserve.js"));