import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./stylesheets/MessageList.module.css";

const MessageList = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // Nouveau : message sélectionné
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get("/api/controllers/messages/message");
        console.log("Réponse de l'API:", response.data);
        setMessages(response.data.data || response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des messages:", error);
        setError("Erreur lors de la récupération des messages");
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const handleSelectMessage = (message) => {
    editMessage(message);
    setSelectedMessage(message); // Affiche le message sélectionné et cache la liste
  };

  const handleDeleteMessage = async (id) => {
    try {
      await axios.delete(`/api/controllers/messages/message`, {
        params: { id },
      });
      setMessages(messages.filter((message) => message.id !== id));
      setSelectedMessage(null); // Retour à la liste après suppression
    } catch (error) {
      console.error("Erreur lors de la suppression du message:", error);
    }
  };

  const editMessage = async (message) => {
    if (message.state === "no-read") {
      try {
        // Remplacez ceci par la logique réelle d'édition du message

        const updatedMessage = { ...message }; // Exemple de mise à jour
        updatedMessage.state = "read";
        await axios.put(
          `/api/controllers/messages/message?id=${message.id}`,
          updatedMessage
        );
        setMessages(messages.map((msg) => (msg.id === message.id ? updatedMessage : msg)));
      } catch (error) {
        console.error("Erreur lors de la modification du message:", error);
      }
    }
  };

  const handleBackToList = () => {
    setSelectedMessage(null); // Réaffiche la liste de messages
  };

  if (loading) return <div>Chargement des messages...</div>;
  if (error) return <div>{error}</div>;

  if (!Array.isArray(messages)) {
    return <div>Aucun message à afficher</div>;
  }

  function nl2br(text) {
    return text.split("\n").map((item, index) => (
      <span key={index}>
        {item}
        <br />
      </span>
    ));
  }

  return (
    <div className={styles.container}>
      {!selectedMessage && (
        <div className={styles.emailList}>
          <div className={styles.emailHeader}>
            <span>Boîte de réception</span>
          </div>
          <ul>
            {messages.map((message) => (
              <li
                key={message.id}
                className={`${styles.emailItem} ${styles[message.state]}`}
                onClick={() => handleSelectMessage(message)} // Sélection du message
              >
                <div>
                  <p className={styles.emailSender}>
                    {message.firstname} {message.lastname}
                  </p>
                  <p className={styles.emailSubject}>{message.objet}</p>
                </div>

                <p className={styles.emailDate}>
                  {new Date(message.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {selectedMessage && (
        <div className={styles.messageDetail}>
          <button className={styles.backButton} onClick={handleBackToList}>
            Back
          </button>
          <h3>{selectedMessage.objet}</h3>
          <p className={styles.messageContent}>
            {nl2br(selectedMessage.message)}
          </p>
          <p>
            <strong>From: </strong>
            {selectedMessage.firstname} {selectedMessage.lastname}
          </p>
          <p>
            <strong>Email: </strong>
            {selectedMessage.email}
          </p>
          <p>
            <strong>Phone: </strong>
            {selectedMessage.telephone}
          </p>          <p>
            <strong>Date: </strong>
            {new Date(selectedMessage.date).toLocaleString()}
          </p>

          <button
            className={styles.deleteButton}
            onClick={() => handleDeleteMessage(selectedMessage.id)}
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
};

export default MessageList;
