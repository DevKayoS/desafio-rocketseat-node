import {randomUUID} from 'node:crypto'
import { Database } from './database.js'

const database = new Database()

export const routes = [
  {
    //rota de criacao de nova task
    method: 'POST',
    path: '/task',
    handler: (req,res) => {
      //pegando os dados que vieram do corpo da requisicao
      const {title, description} = req.body
      //criando objeto para ser salvo no banco
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: 0,
        created_at: new Date(),
        updated_at: new Date()
      }
      // salvando no banco
      database.insert('task', task)

      return res.writeHead(201).end()
    }
  },
  {
    // criando rota para resgatar todas as tasks
    method: 'GET',
    path: '/task',
    handler: (req,res) => {
      const data = database.select('task')
        
      return res.end(JSON.stringify(data))
    }
  },

]