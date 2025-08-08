const { exec } = require('child_process');
const path = require('path');

const cliente = process.argv[2];
if (!cliente) {
  console.log("❌ Informe o nome do cliente. Exemplo: node start-client.js cliente1");
  process.exit(1);
}

const clientPath = path.join(__dirname, 'clients', cliente, 'index.js');
exec(`node ${clientPath}`, (err, stdout, stderr) => {
  if (err) {
    console.error(`❌ Erro ao iniciar ${cliente}:`, err);
    return;
  }
  console.log(stdout);
  console.error(stderr);
});
