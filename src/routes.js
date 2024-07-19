import {randomUUID} from 'node:crypto'
import { Database } from './database.js'
import { buildRoutePath } from './utils/build-route-path.js'

const database = new Database()

export const routes = [
  {
    //rota de criacao de nova task
    method: 'POST',
    path: buildRoutePath('/tasks'),
    handler: (req,res) => {
      //pegando os dados que vieram do corpo da requisicao
      const {title, description} = req.body
      //criando objeto para ser salvo no banco
      const task = {
        id: randomUUID(),
        title,
        description,
        completed_at: null,
        created_at: new Date(),
        updated_at: new Date()
      }
      // salvando no banco
      database.insert('tasks', task)

      return res.writeHead(201).end()
    }
  },
  {
    //rota para pegar todas as tasks ou pegar as tasks filtradas
    method: 'GET',
    path: buildRoutePath('/tasks'),
    handler: (req, res) => {
      const { search } = req.query

      const tasks = database.select('tasks', {
        title: search,
        description: search
      })

      return res.end(JSON.stringify(tasks))
    }
  },
  {
    //rota de atualização de task
    method: 'PUT',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      //pegando o id que veio pelos parametros da requisição
      const {id} = req.params
      //validando o id
      if(!id){
        return res.writeHead(404).end(JSON.stringify({message: "this id not exists"}))
      }

      //pegando os dados que vieram do corpo da requisicao
      const {title, description} = req.body

      if(!title && !description){
        return res.writeHead(400).end(JSON.stringify({ message: 'title or description are required' }))
      }
      //pegando os dados do banco
      const [tasks] = database.select('tasks', { id })
      //criando objeto para ser salvo no banco
      const updatedTask = {
        id,
        title: title ?? tasks.title,
        description: description ?? tasks.description,
        completed_at: tasks.completed_at,
        created_at: tasks.created_at,
        updated_at: new Date()
      }
      // atualizando no banco
      database.update('tasks', id, updatedTask)

      return res.writeHead(204).end(JSON.stringify(updatedTask))
    }
  },
  {
    //rota de atualização de task
    method: 'DELETE',
    path: buildRoutePath('/tasks/:id'),
    handler: (req,res) => {
      //pegando o id que veio pelos parametros da requisição
      const {id} = req.params
      //validando o id
      if(!id){
        return res.writeHead(404).end(JSON.stringify({message: "this id not exists"}))
      }   
      // deletando task do banco
      database.delete('tasks', id)

      return res.writeHead(204).end()
    }
  },
  {
    //rota para completar a task
    method: 'PATCH',
    path: buildRoutePath('/tasks/:id/complete'),
    handler: (req,res) => {
      //pegando o id que veio pelos parametros da requisição
      const {id} = req.params
      if(!id){
        return res.writeHead(404).end(JSON.stringify({message: "this id not exists"}))
      }
      //pegando os dados do banco
      const [tasks] = database.select('tasks', { id })
      if(!tasks){
        return res.writeHead(404).end()
      }

      let completedTasks = new Date()

      if(tasks.completed_at === !null){
        completedTasks = null
      }
      //criando objeto para ser salvo no banco
      const completeTask = {
        id,
        title: tasks.title,
        description: tasks.description,
        completed_at: completedTasks,
        created_at: tasks.created_at,
        updated_at: new Date()
      }
      // atualizando no banco
      database.complete('tasks', id, completeTask)

      return res.writeHead(204).end()
    }
  },
]