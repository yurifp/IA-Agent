const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const clientsDir = path.resolve(__dirname, 'clients');

fs.readdir(clientsDir, (err, files) => {
  if (err) {
    console.error('Erro lendo clients:', err);
    return;
  }

  // Filtra só diretórios
  const clients = files.filter(file => {
    return fs.statSync(path.join(clientsDir, file)).isDirectory();
  });

  if (clients.length === 0) {
    console.log('Nenhum cliente encontrado em clients/');
    return;
  }

  clients.forEach(cliente => {
    console.log(`Iniciando agente para cliente: ${cliente}`);

    const proc = spawn('node', ['executarCliente.js', cliente], {
      cwd: path.resolve(__dirname),
      shell: true
    });

    proc.stdout.on('data', data => {
      process.stdout.write(`[${cliente}] ${data}`);
    });

    proc.stderr.on('data', data => {
      process.stderr.write(`[${cliente} ERRO] ${data}`);
    });

    proc.on('close', code => {
      console.log(`[${cliente}] Processo finalizado com código ${code}`);
    });
  });
});
