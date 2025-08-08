// arquivo: agenteYuri.js

import { create, Whatsapp } from 'venom-bot';
import { Configuration, OpenAIApi } from 'openai';

// Configuração OpenAI
const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

// Prompt base do Agente Yuri para GPT
const promptBase = `
Você é o Agente Yuri, um assistente virtual de suporte ao cliente, muito educado, simpático e claro. 
Responda sempre de forma humana, empática, e ajude o cliente da melhor forma possível.
`;

// Função para chamar o GPT com o prompt e a mensagem do cliente
async function responderCliente(mensagemCliente) {
  const promptCompleto = `${promptBase}\nCliente: ${mensagemCliente}\nAgente Yuri:`;

  const response = await openai.createCompletion({
    model: 'text-davinci-003', // ou 'gpt-4' se estiver disponível
    prompt: promptCompleto,
    max_tokens: 150,
    temperature: 0.7,
    stop: ['Cliente:', 'Agente Yuri:'],
  });

  return response.data.choices[0].text.trim();
}

// Inicializa Venom e escuta mensagens
create('AgenteYuriSession').then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg === false) { // só responde em conversa privada
      console.log('Mensagem recebida:', message.body);

      const resposta = await responderCliente(message.body);

      console.log('Resposta do Agente Yuri:', resposta);

      client.sendText(message.from, resposta);
    }
  });
}
