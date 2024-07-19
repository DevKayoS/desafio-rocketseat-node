import http from "node:http"
import { routes } from "./routes.js"
import { json } from "./middleware/json.js"

//iniciando servidor
const server = http.createServer(async(req,res)=>{
  //pegando dados da requisicao
  const {method, url} = req
  //fazer o servidor entender json
  await json(req,res)
  // rotas
  const route = routes.find(route => {
    return route.method === method && route.path === url
  })

  if(route){
    return route.handler(req, res)
  }

  return res.writeHead(404).end('not found')
})

server.listen(3333)