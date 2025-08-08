require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const venom = require('venom-bot');

// Função principal para rodar o agente para qualquer cliente
async function startAgent(cliente) {
  // Define caminhos relativos para o cliente
  const clientDir = path.resolve(__dirname); // Assumindo que cada cliente tem sua própria pasta com index.js
  const promptPath = path.join(clientDir, 'prompt.txt');
  const promptMestre = fs.readFileSync(promptPath, 'utf8');

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  async function obterRespostaDaIA(mensagem) {
    try {
      const resposta = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          { role: "system", content: promptMestre },
          { role: "user", content: mensagem }
        ],
      });
      return resposta.choices[0].message.content;
    } catch (error) {
      console.error("❌ Erro na IA:", error.message);
      return "⚠️ Desculpe, ocorreu um erro ao gerar a resposta com a IA.";
    }
  }

  // Configuração do Venom com profile Chrome separado por cliente
  venom.create({
    session: cliente,  // usa o nome do cliente para isolar a sessão
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    browserArgs: [
      `--user-data-dir=${path.join(clientDir, 'chrome-data', cliente)}`, // pasta para perfil Chrome por cliente
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-extensions',
      '--disable-gpu',
      '--disable-features=site-per-process',
    ],
    multidevice: false,
    catchQR: (qr) => {
      console.log(`\n[${cliente}] 📱 Escaneie este QR code:\n`, qr);
    },
  })
  .then(client => {
    console.log(`✅ [${cliente}] Cliente conectado!`);

    client.onMessage(async (message) => {
      if (!message.isGroupMsg && message.body) {
        console.log(`📩 [${cliente}] Mensagem de ${message.from}: "${message.body}"`);

        const respostaIA = await obterRespostaDaIA(message.body);

        console.log(`🤖 [${cliente}] Resposta IA: "${respostaIA}"`);

        await client.sendText(message.from, respostaIA);
      }
    });
  })
  .catch(error => {
    console.error(`\n❌ [${cliente}] Erro ao iniciar Venom:`, error);
  });
}

// Lê argumento do cliente passado no CLI: ex: node index.js cliente1
const cliente = process.argv[2];
if (!cliente) {
  console.error('❌ Por favor, informe o nome do cliente na execução: node index.js cliente1');
  process.exit(1);
}

startAgent(cliente);
