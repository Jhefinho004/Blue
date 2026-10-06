const chat = document.getElementById("chat");
const input = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const micButton = document.getElementById("micButton");


// Adiciona uma mensagem na tela
function addMessage(text, type) {

    const message = document.createElement("div");

    message.classList.add("message");

    if (type === "blue") {
        message.classList.add("blue-message");
    } else {
        message.classList.add("user-message");
    }

    message.textContent = text;

    chat.appendChild(message);

    // Desce automaticamente para a mensagem mais recente
    chat.scrollTop = chat.scrollHeight;
}


// Faz a Blue responder
function blueReply(text) {

    const question = text.toLowerCase();

    let response;

    if (question.includes("olá") || question.includes("oi")) {

        response = "Olá! Eu sou a Blue. Como posso ajudar você?";

    } else if (question.includes("seu nome")) {

        response = "Meu nome é Blue.";

    } else if (question.includes("quem é você")) {

        response = "Eu sou a Blue, sua assistente virtual.";

    } else if (question.includes("tudo bem")) {

        response = "Estou funcionando perfeitamente.";

    } else {

        response = "Ainda estou aprendendo. Em breve poderei responder perguntas muito mais complexas.";

    }

    addMessage(response, "blue");

    // Faz a Blue falar
    speak(response);
}


// Envia uma mensagem
function sendMessage() {

    const text = input.value.trim();

    if (text === "") {
        return;
    }

    addMessage(text, "user");

    input.value = "";

    // Pequeno atraso para parecer uma resposta natural
    setTimeout(() => {
        blueReply(text);
    }, 500);
}


// Quando clicar no botão enviar
sendButton.addEventListener("click", sendMessage);


// Quando apertar Enter
input.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


// Sistema de voz da Blue
function speak(text) {

    if (!("speechSynthesis" in window)) {
        return;
    }

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = "pt-BR";
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.cancel();

    window.speechSynthesis.speak(speech);
}


// Reconhecimento de voz
const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

let recognition;

if (SpeechRecognition) {

    recognition = new SpeechRecognition();

    recognition.lang = "pt-BR";
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = function(event) {

        const text = event.results[0][0].transcript;

        input.value = text;

        sendMessage();

    };

    recognition.onerror = function() {

        addMessage(
            "Não consegui entender sua voz.",
            "blue"
        );

    };

}


// Quando clicar no microfone
micButton.addEventListener("click", function() {

    if (!recognition) {

        addMessage(
            "O reconhecimento de voz não está disponível neste navegador.",
            "blue"
        );

        return;
    }

    recognition.start();

});
