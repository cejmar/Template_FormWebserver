// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const crypto = require("crypto");

const dbPath = path.resolve(__dirname, "./data/db.sqlite");

let db;

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex");
}

function initDB() {
  db = new sqlite3.Database(dbPath);

  db.serialize(() => {
  // Event Tabelle
  db.run(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      name TEXT,
      start_date TEXT,
      end_date TEXT
    )
  `);
  // Teilnehmer
  db.run(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id INTEGER,
      name TEXT,
      email TEXT,
      questions_suggestions TEXT,
      payment_method TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(event_id) REFERENCES events(id)
    )
  `);
  // Admin-Nutzer
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      email TEXT,
      notifications BOOL
    )
  `, () => {
    // Prüfen ob superuser existiert
    db.get(`SELECT * FROM users WHERE username = ?`, [process.env.ADMIN_USERNAME], (err, row) => {
      if (!row) {
        const hashed = hashPassword(process.env.ADMIN_PASSWORD);
        db.run(`INSERT INTO users (username, password, email, notifications) VALUES (?, ?, ?, ?)`, [process.env.ADMIN_USERNAME, hashed, null, false], () => {
          console.log("🛡️ Admin-User wurde erstellt.");
        });
      }
    });
  });
});
}

function validateAdminLogin(username, password) {
  return new Promise((resolve, reject) => {
    const hashed = hashPassword(password);
    db.get(`SELECT * FROM users WHERE username = ? AND password = ?`, [username, hashed], (err, row) => {
      if (err) return reject(err);
      resolve(row); // row = vollständiger User-Datensatz oder null
    });
  });
}

function getAllRegistrations() {
  return new Promise((resolve, reject) => {
    db.all(`SELECT * FROM registrations ORDER BY created_at DESC`, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function saveRegistration(slug, { name, email, questions_suggestions, payment_method }) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM events WHERE slug = ?`, [slug], (err, event) => {
      if (err || !event) return reject("Event nicht gefunden");

      db.run(
        `INSERT INTO attendance (event_id, name, email, questions_suggestions, payment_method) VALUES (?, ?, ?, ?, ?)`,
        [event.id, name, email, questions_suggestions, payment_method],
        function (err) {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  });
}

function getRegistrationsForEvent(slug) {
  return new Promise((resolve, reject) => {
    db.get(`SELECT id FROM events WHERE slug = ?`, [slug], (err, event) => {
      if (err || !event) return reject("Event nicht gefunden");

      db.all(
        `SELECT * FROM attendance WHERE event_id = ? ORDER BY created_at DESC`,
        [event.id],
        (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        }
      );
    });
  });
}

function getEvents() {
  return new Promise((resolve, reject) => {
    const now = new Date().toISOString();
    db.all(
      `SELECT * FROM events`,
      (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      }
    );
  });
}

function addEvent({ slug, name, start_date, end_date }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO events (slug, name, start_date, end_date) VALUES (?, ?, ?, ?)`,
      [slug, name, start_date, end_date],
      function (err) {
        if (err) return reject(err);
        resolve();
      }
    );
  });
}


module.exports = {
  initDB,
  validateAdminLogin,
  getAllRegistrations,
  saveRegistration,
  getEvents,
  addEvent,
  getRegistrationsForEvent
};
