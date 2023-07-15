const bodyParser = require("body-parser");
const express = require("express");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");
mongoose.connect("mongodb+srv://poorab202:Atlas12345@mycluster.fbnuu4h.mongodb.net/?retryWrites=true&w=majority");
// console.log(typeof express);
const itemSchema = {
  name: {
    type: String,
    required: true,
  },
};
const Item = mongoose.model("items", itemSchema);

const defaultItems = [
  {
    name: "go for a walk",
  },
  {
    name: "do yoga",
  },
  {
    name: "have breakfast",
  },
];

const listSchema = {
  name: {
    type: String,
    required: true,
  },
  items: [itemSchema],
};
const List = mongoose.model("list", listSchema);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs"); // ejs module is used to make a template of HTML file which will dynamically change as per the logic in server. This line tells our app to use view engine to implement ejs. we need to create a "views" folder which will contain a ejs file.
var toDoItems = [];
var day = date.getDate();
app.get("/", function (req, res) {
  Item.find()
    .then((items) => {
      toDoItems = items;
      if (toDoItems.length === 0) {
        Item.insertMany(defaultItems)
          .then(() => { })
          .catch((err) => {
            console.log("failed because of " + err);
          });
        res.redirect("/");
      } else {
        res.render("list", { title: day, newListItems: toDoItems });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.post("/", (req, res) => {
  let newItem = new Item({
    name: req.body.newItem,
  });

  if (req.body.title === day) {
    newItem.save();
    res.redirect("/");
  } else {
    List.updateOne(
      { name: req.body.title },
      { $push: { items: { name: req.body.newItem } } }
    )
      .then(() => { })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/" + req.body.title);
  }
});

app.post("/delete", (req, res) => {
  if (req.body.pageTitle === day) {
    Item.deleteOne({ _id: req.body.checkbox })
      .then()
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOneAndUpdate(
      { name: req.body.pageTitle },
      { $pull: { items: { _id: req.body.checkbox } } }
    )
      .then((doc) => { })
      .catch((err) => {
        console.log(err);
      });
    res.redirect("/" + req.body.pageTitle);
  }
});

app.get("/favicon.ico", (req, res) => res.status(204));
app.get("/:name", (req, res) => {
  const customName = _.capitalize(req.params.name);
  List.findOne({ name: customName })
    .then((doc) => {
      if (doc === null) {
        const list = new List({
          name: customName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + req.params.name);
      } else {
        res.render("list", { title: doc.name, newListItems: doc.items });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

app.listen(3000, function () {
  console.log("server is running!");
});
