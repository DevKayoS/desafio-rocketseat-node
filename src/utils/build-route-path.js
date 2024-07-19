//funcao que formata a url para conseguir identificar de forma dinamica qualquer coisa dps dos :
export function buildRoutePath(path){
  const routeParametersRegex = /:([a-zA-Z]+)/g
  //pegando os parametros da url
  const paramsWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\-_]+)')
  // pegando os parametros da url e os parametros de busca
  const pathRegex = new RegExp(`^${paramsWithParams}(?<query>\\?(.*))?$`)

  return pathRegex
}