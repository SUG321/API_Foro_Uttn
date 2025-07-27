const { MongoClient, ObjectId, Long, Decimal128 } = require('mongodb');
const fs = require('fs');
const path = require('path');

const url = 'mongodb://localhost:27017';
const dbName = 'foro_uttn';

async function exportarColecciones() {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Conectado a MongoDB');

    const db = client.db(dbName);
    const colecciones = await db.listCollections().toArray();

    const outputDir = './Database';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    for (const coleccion of colecciones) {
      const collectionName = coleccion.name;
      const documentos = await db.collection(collectionName).find().toArray();

      // Convertir ObjectId, Date y otros tipos a formato Extended JSON
      const documentosConvertidos = documentos.map(doc => {
        return JSON.parse(JSON.stringify(doc, (key, value) => {
          if (value instanceof ObjectId) {
            return { "$oid": value.toString() };
          }
          if (value instanceof Date) {
            return { "$date": value.toISOString() };
          }
          if (value instanceof Long) {
            return { "$numberLong": value.toString() };
          }
          if (value instanceof Decimal128) {
            return { "$numberDecimal": value.toString() };
          }
          return value;
        }));
      });

      const filePath = path.join(outputDir, `${collectionName}.json`);

      fs.writeFileSync(filePath, JSON.stringify(documentosConvertidos, null, 4), 'utf8');
      console.log(`Colección "${collectionName}" exportada a "${filePath}"`);
    }

    console.log('Exportación completada.');
  } catch (error) {
    console.error('Error al exportar colecciones:', error);
  } finally {
    await client.close();
  }
}

exportarColecciones();
