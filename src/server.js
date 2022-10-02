const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const appointmentService = require("./services/appointmentService");


// BODY PARSER
app.use(bodyParser.json());
//  PARSE APPLICATION/X-WWW-FORM
app.use(bodyParser.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.use(express.static("./src/public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/Appointment", {
  useNewUrlParser: true,
});

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/calendar", async (req, res) => {
  let result = await appointmentService.GetAll(false);
  res.json(result);
});

app.get("/agendar", (req, res) => res.render("create"));

app.post("/create", async (req, res) => {
  const status = await appointmentService.Create(
    req.body.name,
    req.body.email,
    req.body.description,
    req.body.cpf,
    req.body.date,
    req.body.time
  );
  if (status) {
    res.redirect("/");
  } else {
    res.send("Ocorreu um erro");
  }
});

app.get("/event/:id", async (req, res) => {
  const appointment = await appointmentService.GetById(req.params.id);
  res.render("event", { appo: appointment });
});

app.post("/finish", async (req, res) => {
  let id = req.body.id;
  const result = await appointmentService.Finish(id);

  res.redirect("/");
});

app.get("/list", async (req, res) => {
  let appos = await appointmentService.GetAll(true);
  res.render("list", { appos });
});

app.get("/search", async (req, res) => {
  let appos = await appointmentService.Search(req.query.search);
  res.render("list", { appos });
});

const time = 1000 * 60 * 10;
setInterval(async () => {
  await appointmentService.SendNotification();
}, time);
app.listen(port, () => console.log(`Server on ${port}!`));
