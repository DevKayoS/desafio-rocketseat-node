import http from "node:http"
import { routes } from "./routes.js"
import { json } from "./middleware/json.js"
import { extractQueryParams } from "./utils/extract-query-params.js"

//iniciando servidor
const server = http.createServer(async(req,res)=>{
  //pegando dados da requisicao
  const {method, url} = req
  //fazer o servidor entender json
  await json(req,res)
  // rotas
  const route = routes.find(route => {
    return route.method === method && route.path.test(url)
  })

  if(route){
    //pegando os parametros da rota
    const routeParams = req.url.match(route.path)
    const {query, ...params} = routeParams.groups
    req.params = params
    // se tiver um parametro de busca ele vai formatar e caso nao tenha vai mandar um objeto vazio
    req.query = query ? extractQueryParams(query) : {}
    console.log(req.query)
    return route.handler(req, res)
  }
  // caso nao tenha encontrado a rota vai mandar um not found
  return res.writeHead(404).end('not found')
})

server.listen(3333)