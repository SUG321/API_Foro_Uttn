const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const url = 'mongodb://localhost:27017';
const dbName = 'foro_uttn';

function exportarColecciones() {
  const outputDir = path.join(__dirname, '..', 'Database');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const command = `mongodump --uri="${url}/${dbName}" --out="${outputDir}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al ejecutar mongodump:', error);
      return;
    }
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    console.log('Exportación completada.');
  });
}

exportarColecciones();