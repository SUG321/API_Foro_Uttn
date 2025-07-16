const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const url = 'mongodb://localhost:27017';
const dbName = 'foro_uttn';
const outputDir = './Database';

async function importarColecciones() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db(dbName);

    const archivos = fs.readdirSync(outputDir);

    for (const archivo of archivos) {
      if (path.extname(archivo) === '.json') {
        const coleccionName = path.basename(archivo, '.json');
        const filePath = path.join(outputDir, archivo);

        const documentos = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        const collection = db.collection(coleccionName);
        await collection.deleteMany({});
        console.log(`Registros de la colección "${coleccionName}" eliminados.`);

        if (documentos.length > 0) {
          await collection.insertMany(documentos);
          console.log(`Se han importado ${documentos.length} documentos en la colección "${coleccionName}".`);
        }
      }
    }

    console.log('Importación completada.');
  } catch (error) {
    console.error('Error al importar colecciones:', error);
  } finally {
    await client.close();
  }
}

importarColecciones();
