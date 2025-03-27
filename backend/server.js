// backend/server.js
const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bodyParser = require("body-parser");
const { initDB, getRegistrationsForEvent, saveRegistration, validateAdminLogin, getAllRegistrations, getEvents, addEvent} = require("./db");
const { sendConfirmationMail, sendAdminNotification } = require("./mailer");

require("dotenv").config();

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rate Limiting (z. B. 5 Registrierungen pro 10 Minuten/IP)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
});
app.use("/register", limiter);

// Init DB
initDB();

/*
// API: Formular absenden
app.post("/register", async (req, res) => {
  const { name, email, questions_suggestions, payment_method, honeypot } = req.body;
  //[name, email, questions_suggestions, payment_method]
  if (honeypot) return res.status(400).send("You tried too many times");

  try {
    await saveRegistration({ name, email, questions_suggestions, payment_method});

    await sendConfirmationMail(name, email);
    await sendAdminNotification(name, email, questions_suggestions, payment_method);

    res.status(200).send("Erfolgreich angemeldet");
  } catch (err) {
    console.error(err);
    res.status(500).send("Fehler bei der Anmeldung");
  }
});
*/

// Admin Login
app.post("/admin/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await validateAdminLogin(username, password);
    if (user) {
      res.status(200).json({ success: true, user }); // <- user = { id, username, email, notifications, ... }
    } else {
      res.status(401).json({ success: false, message: "Falsche Zugangsdaten" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fehler beim Login" });
  }
});

// Admin: Liste aller Anmeldungen
app.get("/admin/registrations", async (req, res) => {
  try {
    const list = await getAllRegistrations();
    res.status(200).json(list);
  } catch (err) {
    res.status(500).json({ message: "Fehler beim Laden der Anmeldungen" });
  }
});

// API: Formular absenden
app.post("/register/:slug", async (req, res) => {
  const slug = req.params.slug;
  const { name, email, questions_suggestions, payment_method, honeypot } = req.body;

  if (honeypot) return res.status(400).send("You tried too many times");

  try {
    await saveRegistration(slug, { name, email, questions_suggestions, payment_method });
    res.status(200).send("Erfolgreich angemeldet");
  } catch (err) {
    console.error(err);
    res.status(500).send("Fehler bei der Anmeldung");
  }
});

app.get("/events", async (req, res) => {
  try {
    const events = await getEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Laden der Events" });
  }
});

//todo keine db requests in server.js

app.post("/admin/events", async (req, res) => {
  const { slug, name, start_date, end_date } = req.body;
  try {
    await addEvent({ slug, name, start_date, end_date });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Fehler beim Erstellen des Events" });
  }
});


app.get("/admin/registrations/:slug", async (req, res) => {
  const slug = req.params.slug;
  try {
    const registrations = await getRegistrationsForEvent(slug);
    res.status(200).json(registrations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Fehler beim Laden der Anmeldungen" });
  }
});


app.listen(port, () => {
  console.log(`Backend läuft auf http://localhost:${port}`);
});
