const express = require("express");

const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
  name: String,
};

const Item = new mongoose.model("Item", itemSchema);

const newItem1 = new Item({
  name: "To Eat",
});

const newItem2 = new Item({
  name: "To Drink",
});

const newItem3 = new Item({
  name: "To Bath",
});

const defaultItems = [newItem1, newItem2, newItem3];

const listSchema = {
  name: String,
  listItems: [itemSchema],
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {
  Item.find({}, function (err, results) {
    if (defaultItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Inserted Successfully");
        }
      });
      res.redirect("/");
    } else {
      if (err) {
        console.log(err);
      } else {
        res.render("list", { listTitle: "To Do List", newListItems: results });
      }
    }
  });
});

app.get("/:newPage", function (req, res) {
  const newListName = req.params.newPage;

  List.findOne({ name: newListName }, function (err, findList) {
    if (!findList) {
      const newList = new List({
        name: newListName,
        listItems: defaultItems,
      });
      newList.save();
    } else {
      res.render("list", {
        listTitle: newListName,
        newListItems: findList.listItems,
      });
    }
  });
  res.redirect("/" + newListName);
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;

  const newItem = new Item({
    name: itemName,
  });
  newItem.save();
  res.redirect("/");
});

app.post("/delete", function (req, res) {
  const deleteItemId = req.body.checkbox;
  Item.findByIdAndRemove(deleteItemId, function (err) {
    if (!err) {
      console.log("Successfully Deleted");
    }
  });
  res.redirect("/");
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
