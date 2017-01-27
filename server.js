var express = require("express");
var favicon = require("serve-favicon");
var morgan = require("morgan");
var path = require("path");

var app = express();

app.use(morgan("combined", {
    skip: function(req, res) {
        return res.statuscode < 400;
    }
}));

app.use(express.static(path.join(__dirname, "app")));
//app.use(favicon(__dirname + "/app/assets/imgs/favicon.ico"));

app.use(function(req, res, next) {
    console.log("/" + req.method);
    next();
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + "/index.html"));
});

app.get("*", function(req, res) {
    res.status(404).send("No such page");
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Listening on port 3000")
});