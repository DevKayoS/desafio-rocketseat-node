import fs from 'node:fs/promises'

// caminho do arquivo
const databasePath =  new URL('../db.json', import.meta.url)

export class Database {
 //deixando metodo privado 
  #database = {}

  constructor(){
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(()=>{
      this.#persist()
    })
  }

  //criando metodo para persistencia de dados
  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  // criando metodo para criar nova task
  insert(table, data) {
    // caso tabela ja exista apenas adiciona mais uma linha
    if(Array.isArray(this.#database[table])){
      this.#database[table].push(data)
    } else {
      // criando uma nova tabela e adicionando o dado a essa nova tabela
      this.#database[table] = [data]
    }
    //persistindo os dados no banco
    this.#persist()

    return data
  }
  //criando metodo para resgatar todas as tasks
  select(table) {
    const data = this.#database[table] ?? []
    return data
  }
}