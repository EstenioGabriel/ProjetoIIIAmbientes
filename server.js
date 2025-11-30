const express = require("express");
// Importa o framework Express usando require (CommonJS)

const path = require("path");
// Importa módulo nativo do Node que lida com caminhos de arquivos

const app = express();
// Cria a instância da aplicação Express

const port = 3000;
// Define a porta (variável 'port') usada pelo servidor

app.use(express.static(path.join(__dirname, "public")));
// Essa função faz o Express servir todo o conteúdo da pasta public como conteúdo do FrontEnd

app.listen(port, () => {
  // NÃO PODE SER ALTERADO – PARTE DA BIBLIOTECA
  // listen(PORTA DO SERVIDOR , callback) é obrigatório desse jeito.

  console.log(`Server running on port ${port}`);
});

/*
REMOVIDOS:

function doStuff(req, res) 
Removida pois ela faz o mesmo trabalho do comando app.use(express.static(path.join(__dirname, 'public'))) 
so que de forma mais redundante e complexa

app.get('/', doStuff);
Como a função doStuff foi removida não há necessidade desse comando

var globalVar = "I am global";
Não há utilidade

function f1() {
  return true;
}
Não há utilidade

var unused = "this is never used";
Não há utilidade

var x = 10;
var y = 20;
Não há utilidade


var msg
Substituída pelo template literals
*/
