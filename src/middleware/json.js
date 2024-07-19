export async function json(req, res){
  const buffers = []
  //salvando a requisicao em array
  for await (const chunk of req){
    buffers.push(chunk)
  }
  try {
    // transformando o array buffers em JSON e atribuindo ao corpo da requisicao
    req.body = JSON.parse(Buffer.concat(buffers).toString())
  } catch{
    //caso nao tenha nada vindo do corpo da requisicao enviar o req.body como null
    req.body = null
  }
  // configurando o cabecalho da requisicao para a API entender que sera recebido dados em formato JSON
  res.setHeader('Content-type', 'application/json')
}