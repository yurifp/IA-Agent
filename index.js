require('dotenv').config();
const fs = require('fs');
const { OpenAI } = require('openai');
const venom = require('venom-bot');


const promptMestre = fs.readFileSync('./prompt.txt', 'utf8');


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

// Inicializa o Venom
venom.create({
  session: 'gpt-whatsapp',
  headless: false,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-gpu',
    '--disable-features=site-per-process',
  ],
  multidevice: false,
  catchQR: (qr) => {
    console.log('\n📱 Escaneie este QR code:\n', qr);
  },
})
.then(client => {
  console.log('✅ Cliente conectado!');

  client.onMessage(async (message) => {
    if (!message.isGroupMsg && message.body) {
      console.log(`📩 Mensagem de ${message.from}: "${message.body}"`);

      const respostaIA = await obterRespostaDaIA(message.body);

      console.log(`🤖 Resposta IA: "${respostaIA}"`);

      await client.sendText(message.from, respostaIA);
    }
  });
})
.catch(error => {
  console.error('\n❌ Erro ao iniciar Venom:', error);
});
