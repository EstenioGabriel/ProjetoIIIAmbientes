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


