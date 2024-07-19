import fs from 'node:fs';
import csv from 'csv-parser';
import axios from 'axios';

// Caminho para o arquivo CSV
const csvFilePath =  new URL('./tasks.csv', import.meta.url)


// URL do endpoint da API
const apiEndpoint = 'https://localhost:3333/tasks';

// Função para criar uma task
async function createTask(task) {
  try {
    const response = await axios.post(apiEndpoint, task);
    console.log(`Task criada: ${response.data.id}`);
  } catch (error) {
    console.error(`Erro ao criar task: ${error.message}`);
  }
}

// Função para processar o arquivo CSV e criar tasks
function processCSV(filePath) {
  const tasks = [];

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      const task = {
        title: row.title,
        description: row.description,
      };
      tasks.push(task);
    })
    .on('end', async () => {
      console.log(`Arquivo CSV processado. Criando ${tasks.length} tasks...`);
      for (const task of tasks) {
        await createTask(task);
      }
      console.log('Todas as tasks foram criadas.');
    });
}

// Inicia o processamento do arquivo CSV
processCSV(csvFilePath);
