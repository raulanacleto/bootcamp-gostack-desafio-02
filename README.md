Projeto feito para os desafios 02 e 03 do bootcamp(10) da rocketseat.

---
Tecnologias usadas:

* Nodemon e Sucrase
* JSON Web Token para criar um fluxo de autenticação, usado como um middleware.
* Bcrypt para encriptar o password
* Docker para instancias de Banco de Dados (Postgres e Redis)
* Eslint, Prettier e EditorConfig para padronização de código
* Sequelize para criar as migrations e seeders
* Multer para criação do avatar dos usuários
* Nodemailer para envio de E-mail
* Yup para validação dos dados de entrada
* date-fns para manipular data e hora
* Express Handlebars para criação de templates para o envio de E-mail utilizando HTML e CSS

---
Requisitos:
https://github.com/Rocketseat/bootcamp-gostack-desafio-02

https://github.com/Rocketseat/bootcamp-gostack-desafio-03

---
Passo a passo:

sudo docker run --name bancofastfeet -e POSTGRES_PASSWORD=docker -p 5433:5432 -d postgres

sudo docker start bancofastfeet

sudo docker run --name redisfastfeet -p 6379:6379 -d -t redis:alpine

sudo docker start redisfastfeet

---

yarn

yarn sequelize db:migrate

yarn sequelize db:seed:all

yarn dev

yarn queue

---
Para importar no insomnia:

utils/Insomnia_fastfeet.json



