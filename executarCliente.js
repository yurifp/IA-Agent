const path = require('path');
const { spawn } = require('child_process');
const cliente = process.argv[2];

if (!cliente) {
  console.error('❌ Por favor, informe o nome do cliente.');
  process.exit(1);
}
const clientePath = path.resolve(__dirname, 'clients', cliente, 'index.js');

try {
  require(clientePath);
} catch (error) {
  console.error('❌ Erro ao carregar o cliente:', error.message);
}