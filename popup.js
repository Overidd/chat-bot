const $ = (selector) => document.querySelector(selector);
// const $$ = (selector) => document.querySelectorAll(selector);
console.log("tumama")
const $chat_form = $('#chat-form');
const $chat_input = $('#chat-input');

const $load = $('#load');
const $content_chat = $('.content__chat');
const $chat_template = $('#chat-template');

function addMessage(sender) {
    const template = $chat_template.content.cloneNode(true);
    const [img] = template.querySelectorAll('img');
    const [span] = template.querySelectorAll('span');

    img.src = sender.url
    span.textContent = sender.content

    const content = template.querySelector('p')
    content.classList.add('message',sender.role);
    $content_chat.appendChild(content);

    $content_chat.scrollTop  = $content_chat.scrollHeight;
    return span
}   

// Importa el módulo CreateMLCEngine desde la URL especificada

// import { CreateMLCEngine } from "@mlc-ai/web-llm";
import { CreateMLCEngine } from "https://esm.run/@mlc-ai/web-llm";
// Define el modelo seleccionado
const MODEL_IA = 'gemma-2b-it-q4f32_1-MLC'

// Inicializa el motor del modelo de lenguaje
const engine = await CreateMLCEngine(MODEL_IA, {
    initProgressCallback: ({ progress, text }) => {
        console.log(progress)
        console.log(text)
        if (progress === 1) {
            $chat_form.disabled = false; 
            $load.style.display = 'none'
        } else if (progress === 0) {
            $load.style.display = 'block'
            $chat_form.disabled = true; 
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

    addMessage(messages[0])
    const messageBot = addMessage(botReply[0])

    const chunks = await engine.chat.completions.create({ messages, stream: true });
    // let messageText = addMessage();
    for await (const chunk of chunks) {
        const choice = chunk.choices[0];
        const content = choice.delta.content ?? '';
        reply += content;

        messageBot.textContent = reply; 
        $content_chat.scrollTop  = $content_chat.scrollHeight;
    }
}