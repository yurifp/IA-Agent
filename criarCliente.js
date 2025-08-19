const fs = require('fs');
const path = require('path');

const nomeCliente = process.argv[2];

if (!nomeCliente) {
  console.error("❌ Você precisa informar o nome do cliente. Ex: node criarCliente.js cliente3");
  process.exit(1);
}

const caminhoCliente = path.join(__dirname, '..', 'clients', nomeCliente);

if (fs.existsSync(caminhoCliente)) {
  console.error("❌ Este cliente já existe.");
  process.exit(1);
}


fs.mkdirSync(caminhoCliente, { recursive: true });
fs.mkdirSync(path.join(caminhoCliente, 'chrome-data')); 
fs.writeFileSync(path.join(caminhoCliente, 'prompt.txt'), 'Você é um assistente útil.');
fs.writeFileSync(path.join(caminhoCliente, '.env'), 'OPENAI_API_KEY=sua-chave-aqui');

const conteudoIndex = `require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { OpenAI } = require('openai');
const venom = require('venom-bot');

const promptMestre = fs.readFileSync(path.join(__dirname, 'prompt.txt'), 'utf8');

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

const chromeProfilePath = path.join(__dirname, 'chrome-data');

venom.create({
  session: 'gpt-whatsapp',
  headless: false,
  executablePath: 'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe',
  browserArgs: [
    \`--user-data-dir=\${chromeProfilePath}\`,
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-gpu',
    '--disable-features=site-per-process',
  ],
  multidevice: false,
  catchQR: (qr) => {
    console.log('\\n📱 Escaneie este QR code:\\n', qr);
  },
})
.then(client => {
  console.log('✅ Cliente conectado!');

  client.onMessage(async (message) => {
    if (!message.isGroupMsg && message.body) {
      console.log(\`📩 Mensagem de \${message.from}: "\${message.body}"\`);

      const respostaIA = await obterRespostaDaIA(message.body);

      console.log(\`🤖 Resposta IA: "\${respostaIA}"\`);

      await client.sendText(message.from, respostaIA);
    }
  });
})
.catch(error => {
  console.error('\\n❌ Erro ao iniciar Venom:', error);
});
`;

fs.writeFileSync(path.join(caminhoCliente, 'index.js'), conteudoIndex);

console.log(`✅ Cliente "${nomeCliente}" criado com sucesso!`);
