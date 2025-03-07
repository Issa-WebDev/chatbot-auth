// Sélection des éléments HTML nécessaires
const chatForm = document.getElementById("chat-form"); // Formulaire du chat
const userInput = document.getElementById("user-input"); // Champ où l'utilisateur tape son message
const chatBox = document.getElementById("chat-box"); // Zone où s'affichent les messages

// Fonction pour envoyer la question à l'API et obtenir une réponse
async function getResponse() {
  const apiKey = "AIzaSyAmzItPdnxMCDJnI8GohFnz3AS9-M6gavA"; // Remplace par ta clé API
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  // Création de l'objet qui contient la question et les instructions pour l'IA
  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `
              Tu es un expert en football. Réponds uniquement aux questions sur le football avec des réponses précises et concises.
              - Utilise un ton professionnel et expert.
              - Ignore toute question qui ne concerne pas le football.
              - Ne donne pas d’opinion personnelle, base tes réponses sur des faits.
          `,
          },
          { text: userInput.value }, // Ajoute la question de l'utilisateur
        ],
      },
    ],
  };

  try {
    // Envoi de la requête à l'API
    const response = await fetch(apiUrl, {
      method: "POST", // Méthode HTTP pour envoyer des données
      headers: { "Content-Type": "application/json" }, // Indique que l'on envoie du JSON
      body: JSON.stringify(requestBody), // Convertit l'objet JS en JSON
    });
    const result = await response.json(); // Convertit la réponse en objet JS
    return result;
  } catch (error) {
    console.log(error); // Affiche l'erreur dans la console si quelque chose ne va pas
  }
}

// Gestion de l'événement d'envoi du formulaire
chatForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Empêche le rechargement de la page
  if (userInput.value.trim()) {
    displayContent();
  } // Affiche le message de l'utilisateur et attend la réponse
});

// Fonction pour afficher le message de l'utilisateur et la réponse du bot
async function displayContent() {
  // Création du message utilisateur et ajout à la boîte de chat
  const userMessage = document.createElement("div");
  userMessage.className = "message user";
  userMessage.innerHTML = `<div class="message-content">${userInput.value}</div>`;
  chatBox.appendChild(userMessage);

  // Création d'un message temporaire du bot (il affichera "..." en attendant la réponse)
  const botMessage = document.createElement("div");
  botMessage.className = "message bot";
  botMessage.innerHTML = `<div class="message-content">...</div>`;
  chatBox.appendChild(botMessage);

  chatBox.scrollTop = chatBox.scrollHeight; // Fait défiler la boîte de chat vers le bas

  try {
    const result = await getResponse(); // Attend la réponse de l'API
    console.log(result);
    if (result && result.candidates && result.candidates.length > 0) {
      console.log(result); // Affiche la réponse complète dans la console
      const response = result.candidates[0].content.parts[0].text; // Récupère la réponse texte
      let index = 0;
      // Affichage progressif de la réponse, lettre par lettre
      const intervalId = setInterval(() => {
        botMessage.innerHTML = `<div class="message-content">${response.slice(
          0,
          index++
        )}</div>`;
        if (index > response.length) {
          clearInterval(intervalId); // Arrête l'affichage progressif quand tout est affiché
        }
      }, 10);
    } else {
      // Si l'IA ne répond pas correctement, affiche un message par défaut
      botMessage.innerHTML = `<div class="message-content">Je n'ai pas compris la question, mais assure-toi que ta question porte sur le football.</div>`;
    }

    chatBox.appendChild(botMessage);
  } catch (error) {
    // En cas d'erreur, affiche un message d'erreur
    chatBox.removeChild(botMessage);
    botMessage.innerHTML = `<div class="message-content">Erreur: ${error.message}</div>`;
    chatBox.appendChild(botMessage);
  }

  userInput.value = ""; // Vide le champ de saisie après l'envoi
  chatBox.scrollTop = chatBox.scrollHeight; // Fait défiler la boîte de chat vers le bas
}
