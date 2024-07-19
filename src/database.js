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
  select(table, search){
    let data = this.#database[table] ?? []
    //caso tenha query params vai ser enviado a busca
    if(search){
      data = data.filter(row => { //percorrendo todas as linhas da tabela
        //convertendo o objeto search em um array 
        return Object.entries(search).some(([key, value]) => {
          if(!value) return true
          //verificando se dentro da linha do banco de dados existe o valor procurado
          return row[key].includes(value);
        })
      })
    }
    return data
  }
  // metodo para atualização da task
  update(table, id, data){
    //procurando a task no banco de dados e verificando se o id que veio da requisição é o mesmo do que o que esta no db
    const rowIndex = this.#database[table].findIndex(row => row.id === id)
    // se tiver aquele dado no banco de dados sera atualizado
    if(rowIndex > -1){
      this.#database[table][rowIndex] = {id, ...data}
      this.#persist()
    }

    return data
  }
}