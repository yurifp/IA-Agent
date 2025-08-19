import { create, Whatsapp } from 'venom-bot';
import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);


const promptBase = `
Você é o Agente Yuri, um assistente virtual de suporte ao cliente, muito educado, simpático e claro. 
Responda sempre de forma humana, empática, e ajude o cliente da melhor forma possível.
`;


async function responderCliente(mensagemCliente) {
  const promptCompleto = `${promptBase}\nCliente: ${mensagemCliente}\nAgente Yuri:`;

  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: promptCompleto,
    max_tokens: 150,
    temperature: 0.7,
    stop: ['Cliente:', 'Agente Yuri:'],
  });

  return response.data.choices[0].text.trim();
}


create('AgenteYuriSession').then((client) => start(client));

function start(client) {
  client.onMessage(async (message) => {
    if (message.isGroupMsg === false) { 
      console.log('Mensagem recebida:', message.body);

      const resposta = await responderCliente(message.body);

      console.log('Resposta do Agente Yuri:', resposta);

      client.sendText(message.from, resposta);
    }
  });
}
