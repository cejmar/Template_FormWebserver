// backend/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

var fs = require('fs');
var files = fs.readdirSync('/app');
var files2 = fs.readdirSync('/app/data');
console.log(files)

const dbPath = path.resolve(__dirname, "./data/db.sqlite");

let db;

function initDB() {
  db = new sqlite3.Database(dbPath);

  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        questions_suggestions TEXT,
        payment_method TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  });
}

function saveRegistration({ name, email, questions_suggestions, payment_method }) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT INTO registrations (name, email, questions_suggestions, payment_method) VALUES (?, ?, ?, ?)`,
      [name, email, questions_suggestions, payment_method],
      function (err) {
        if (err) reject(err);
        else resolve();
      }
    );
  });
}

module.exports = { initDB, saveRegistration };
