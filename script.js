const $ = (selector) => document.querySelector(selector);
// const $ = (selector) => document.querySelectorAll(selector);

const $chat_form = $('#chat-form');
const $chat_input = $('#chat-input');

const $submit = $('#submit');
const $content_chat = $('#content__chatt');
const $chat_template = $('#chat-template');



function addMessage(sender) {
    const template = $chat_template.content.cloneNode(true);
    const [img, span] = template.querySelectorAll('img', 'span');
    img.src = sender.url
    span.textContent = sender.message

    template.querySelector('p').classList.add('message',sender);
    $content_chat.appendChild(template);
    return span
}   


// Importa el módulo CreateMLCEngine desde la URL especificada
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm"
// Define el modelo seleccionado
const MODEL_IA = 'gemma-2b-it-q4f32_1-MLC'

// Inicializa el motor del modelo de lenguaje
const engine = await CreateMLCEngine(MODEL_IA, {
    initProgressCallback: ({ progress, text }) => {
        // $small.textContent = `${text}`; // Actualiza el texto de progreso
        console.log(text)
        if (progress === 1) {
            // $small.textContent = ''; // Borra el texto al completar la inicialización
            // $button.disabled = false; // Habilita el botón
        } else if (progress === 0) {
            // $button.disabled = true; // Deshabilita el botón durante la inicialización
        }
    }
})

// Genera la respuesta del bot de forma incremental
$chat_form.onsubmit = async (e) => {
    e.preventDefault()

    const message = $chat_input.value;
    let reply = '';
    const messages = [{
        role: 'user',
        url: 'images/person.svg',
        content: message,
    }];
    
    const botReply = [{
        role: 'assistant',
        url: 'images/robot.svg',
        content: reply
    }];

    // addMessage(messages[0])

    const chunks = await engine.chat.completions.create({ messages, stream: true });
    // let messageText = addMessage();
    for await (const chunk of chunks) {
        const choice = chunk?.choices[0];
        const content = choice?.delta?.content ?? '';
        reply += content;

        // botTextMessage.textContent = reply; // Actualiza el mensaje del bot en la interfaz
        console.log(reply)
    }

    


    $content_chat.scrollTop = $content_chat.scrollHeight;
}