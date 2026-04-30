# Social Media API - Teste Técnico

#### API de rede social desenvolvida com foco na alta concorrência de likes, utilizando filas, cache e princípios de arquitetura limpa.

## Principais Funcionalidades da Aplicação

- Listar posts (Feed) com paginação e cache.
- Consultar detalhes de um post específico.
- Registrar likes e unlikes (toggle) em um post de forma assíncrona.
- Ranking em tempo real dos posts com mais likes.
- **[Extra]** Sistema de autenticação (JWT) e criação de usuários.
- **[Extra]** Sistema de comentários em posts processados de forma assíncrona.
  <br></br>

## Tecnologias Utilizadas

- **Node.js:** Ambiente de execução do JavaScript no servidor.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
- **Fastify:** Framework web focado em performance e baixo overhead.
- **Drizzle ORM:** ORM moderno e tipado para a comunicação com o banco de dados (PostgreSQL).
- **Zod:** Biblioteca para validação de esquemas, tipos e geração automática do Swagger.
- **Docker & Docker Compose:** Utilizado para criar e orquestrar um ambiente de desenvolvimento completo com Node, PostgreSQL e Redis.
- **Redis:** Banco de dados em memória utilizado para cache distribuído.
- **BullMQ:** Sistema robusto de gerenciamento de filas de tarefas baseado em Redis.
  <br></br>

## Arquitetura e Design Patterns

A aplicação foi estruturada visando fácil manutenção e testes, inspirada nos princípios de Clean Architecture:

- **Casos de Uso (Use Cases):** A regra de negócio principal é isolada em classes dedicadas (ex: `ListPostsUseCase`, `LikePostUseCase`), separando-a da camada de transporte HTTP (Fastify).
- **Padrão Repository:** Toda interação com o banco de dados foi encapsulada em Repositórios (ex: `PostsRepository`), permitindo que a regra de negócio não conheça detalhes do Drizzle ou do SQL.
- **Padrão Factory:** Utilizado para instanciar as dependências (Use Cases e Repositories) de forma limpa antes de entregá-las aos Controllers.

## RFs (Requisitos funcionais)

- [✅] Deve ser possível listar posts
- [✅] Deve ser possível consultar um post específico
- [✅] Deve ser possível registrar likes em um post informando o usuário
- [✅] Deve ser possível consultar a quantidade de likes de um post
- [✅] Deve ser possível listar os posts com mais likes
- [✅] **[Extra]** Deve ser possível se cadastrar e fazer login
- [✅] **[Extra]** Deve ser possível remover o like (unlike)
- [✅] **[Extra]** Deve ser possível comentar em um post
  <br></br>

## Regras de negócio

- [✅] Um mesmo usuário não pode curtir o mesmo post mais de uma vez.
- [✅] Múltiplas requisições simultâneas de like devem ser tratadas corretamente.
- [✅] A quantidade de likes deve permanecer consistente mesmo sob concorrência.
  <br></br>

## RNFs (Requisitos não-funcionais)

- [✅] Usar Node.js (com TypeScript).
- [✅] Os dados principais precisam ser armazenados no PostgreSQL.
- [✅] A solução deve possuir mecanismo de fila/processamento assíncrono para os likes.
- [✅] A solução deve possuir mecanismo de cache para otimizar cenários de leitura.
- [✅] A API deve possuir documentação em Swagger.
- [✅] O projeto deve conter instruções de execução e README.
- [✅] **[Extra]** Aplicação deve ser conteinerizada com Docker.
  <br></br>

## Rotas da aplicação (Resumo)

_(A documentação interativa completa de todas as rotas está disponível via Swagger na rota `/docs`)_

### `POST /users/register`

**Descrição:** Registra um novo usuário no sistema.

**Corpo da Requisição:**

```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "password": "senha_segura"
}
```

**Resposta de Sucesso (`201 Created`):**

```json
{
  "user_id": "8c5f7f29-a1ea-4872-9ad4-9a1512dfcfbf",
  "name": "João da Silva",
  "email": "joao@email.com"
}
```

### `GET /posts`

**Descrição:** Lista todos os posts (Feed) com paginação e utilizando cache de 60 segundos.

**Parâmetros de Query:**

- `page` (number, opcional, default: 1)
- `limit` (number, opcional, default: 10)

**Corpo da Requisição:** Vazio (`{}`).

**Resposta de Sucesso (`200 OK`):**

```json
[
  {
    "post_id": "c1f7a4b0j0...",
    "title": "Primeiro post",
    "content": "Olá mundo social",
    "likes_count": 42,
    "authorName": "João da Silva"
  }
]
```

### `POST /posts/:id/like`

**Descrição:** Adiciona ou remove (toggle) um like em um post. O processamento é assíncrono (Fila). É necessário enviar o Bearer Token no cabeçalho.

**Parâmetros de Rota:**

- `id` (string): O ID do post que receberá o like.

**Corpo da Requisição:** Vazio (`{}`).

**Resposta de Sucesso (`202 Accepted`):**

```json
{
  "message": "Like processing queued"
}
```

<br></br>

## Problemas encontrados e como foram resolvidos

- Como garantir que 10.000 usuários não quebrem a aplicação ao dar like exatamente ao mesmo tempo no mesmo post (Alta Concorrência)?
- Como evitar requisições pesadas no banco de dados na rota de Feed (Listagem de Posts), já que ela traz dados agregados de comentários e likes?
- Como manter a documentação do Swagger atualizada sem precisar duplicar o código das interfaces e validações?

### Soluções

- **Concorrência e Filas:** A requisição HTTP de like não encosta no banco de dados. O Fastify apenas recebe a requisição, envia uma mensagem para uma fila gerenciada pelo **BullMQ + Redis** e devolve um "202 Accepted" imediato. Trabalhadores (Workers) em _background_ processam essas mensagens. Para evitar likes duplos via _race conditions_, a tabela de likes possui uma trava `UNIQUE(post_id, user_id)`. Se o Worker tentar inserir um like repetido, a transação falha graciosamente, mantendo o total de curtidas totalmente consistente.
- **Cache-Aside para Leitura:** Implementei um mecanismo de cache com **Redis** na listagem do feed. A primeira requisição bate no Postgres e salva o JSON no Redis por 60 segundos. As próximas milhares de requisições respondem em milissegundos acessando direto o Redis. Quando um novo post é criado, o cache da "página 1" é sumariamente apagado (invalidado) para que o feed reflita a atualização em tempo real.
- **Swagger Automático:** Utilizei o `fastify-type-provider-zod`. Ele se aproveita das validações de payload que já faço utilizando a biblioteca **Zod** e converte automaticamente tudo para as especificações visuais do Swagger OpenAPI.

## Próximos Passos (Melhorias Futuras)

Para evoluir ainda mais esta API e transformá-la em uma rede social completa, os seguintes recursos poderiam ser adicionados:

- **Segurança Avançada:** Criptografia das senhas dos usuários utilizando `bcrypt` (atualmente o foco foi na arquitetura de alta concorrência).
- **Sistema de Seguidores (Followers):** Permitir que usuários sigam uns aos outros, criando um feed personalizado apenas com posts de quem eles seguem.
- **Gestão de Posts:**
  - Rota para **editar um post** existente.
  - Rota para **deletar um post** (com exclusão em cascata ou *soft delete* de likes e comentários).
- **Gestão de Usuários:** Rota para buscar os dados de perfil de um usuário específico (ex: `GET /users/:id` ou `GET /users/me`).

## Deploy da aplicação

#### Tanto o servidor HTTP quanto os bancos de dados (PostgreSQL e Redis) foram feitos o deploy na plataforma Railway - https://railway.app

- HTTP server e Swagger UI (para testes diretos no navegador ou Insomnia):

```txt
https://social-media-api-production-e611.up.railway.app
```

> **Dica para testes via Swagger (`/docs`):**
> Acesse a rota `/docs` pela URL de produção acima, utilize a rota `/users/register` para criar um usuário e depois a rota `/users/auth` para logar e copiar o Token gerado e clique no botão **Authorize** no topo do Swagger para testar o envio de likes e comentários!

---

## Como rodar o projeto localmente

1. Tenha o **Docker** e o **Docker Compose** instalados na sua máquina.
2. Clone o repositório e acesse a pasta do projeto.
3. Crie um arquivo `.env` na raiz do projeto copiando o exemplo:
   ```bash
   cp .env.example .env
   ```
   _(O arquivo `.env.example` já possui as variáveis necessárias para rodar o banco de dados e o redis via docker)_:
   ```env
   PORT=3333
   NODE_ENV=dev
   DATABASE_URL=postgresql://social_media_user:social_media_password@localhost:5432/social_media_db
   REDIS_URL=redis://localhost:6380
   JWT_SECRET=meu_segredo_super_seguro_123
   ```
4. Suba toda a infraestrutura com um único comando:
   ```bash
   docker compose up --build
   ```
5. A API, o PostgreSQL e o Redis estarão rodando. O Docker se encarregará de executar as _migrations_ automaticamente para criar as tabelas.
6. Acesse a documentação localmente em `http://localhost:3333/docs`.
