const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const url = 'mongodb://localhost:27017';
const dbName = 'foro_uttn';
const dumpDir = path.join(__dirname, '..', 'Database');

function importarColecciones() {
  if (!fs.existsSync(dumpDir)) {
    console.error('No se encontró el directorio de respaldo:', dumpDir);
    return;
  }

  const command = `mongorestore --uri="${url}/${dbName}" --drop "${path.join(dumpDir, dbName)}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al ejecutar mongorestore:', error);
      return;
    }
    if (stdout) console.log(stdout.trim());
    if (stderr) console.error(stderr.trim());
    console.log('Importación completada.');
  });
}

importarColecciones();