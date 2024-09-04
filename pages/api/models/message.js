import { db } from '../lib/db';

class Messages {
  static selectMessages() {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM messages")
        .then(([results]) => {
          console.log("Query results:", results);
          resolve(results);
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  }

  static selectMessageById(id) {
    return new Promise((resolve, reject) => {
      db.query("SELECT * FROM messages WHERE id = ?", [id])
        .then(([results]) => {
          if (results.length > 0) {
            console.log("Query results:", results[0]);
            resolve(results[0]);
          } else {
            resolve(null); // No message found
          }
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  }

  static insertMessage(firstname, lastname, email, telephone, objet, message, date, state) {
    return new Promise((resolve, reject) => {
      const query = "INSERT INTO messages (firstname, lastname, email, telephone, objet, message, date, state) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
      const values = [firstname, lastname, email, telephone, objet, message, date, state];
      db.query(query, values)
        .then(([results]) => {
          console.log("Inserted message with ID:", results.insertId);
          resolve(results);
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  }

  static updateMessage(id, firstname, lastname, email, telephone, objet, message, date, state) {
    return new Promise((resolve, reject) => {
      const query = "UPDATE messages SET firstname = ?, lastname = ?, email = ?, telephone = ?, objet = ?, message = ?, date = ?, state = ? WHERE id = ?";
      const values = [firstname, lastname, email, telephone, objet, message, date, state, id];
      db.query(query, values)
        .then(([results]) => {
          console.log("Updated message with ID:", id);
          resolve(results);
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  }

  static deleteMessage(id) {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM messages WHERE id = ?";
      db.query(query, [id])
        .then(([results]) => {
          console.log("Deleted message with ID:", id);
          resolve(results);
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  }

  static searchMessagesByKeyword(keyword) {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM messages WHERE message LIKE ?";
      const values = [`%${keyword}%`];
      db.query(query, values)
        .then(([results]) => {
          console.log("Search results:", results);
          resolve(results);
        })
        .catch((error) => {
          console.error("Error executing query:", error);
          reject(error);
        });
    });
  }
}

export { Messages };
