# Social Media API - Teste Técnico

#### API para uma rede social construída com Fastify, focada em alta performance, filas de processamento assíncrono e estratégias avançadas de cache.

## Principais Funcionalidades da Aplicação

- Criação, listagem (Feed) e visualização de Posts.
- Interações sociais: Curtir (Like/Unlike) e Comentar em posts.
- Ranking em tempo real dos posts com mais curtidas.
- Processamento em *background* das interações (likes e comentários) para não bloquear a requisição do usuário.
- Feed otimizado com cache distribuído para suportar picos de tráfego.
<br></br>

## Tecnologias Utilizadas

- **Node.js:** Ambiente de execução do JavaScript no servidor.
- **TypeScript:** Superset do JavaScript que adiciona tipagem estática e segurança ao código.
- **Fastify:** Framework web focado em altíssima performance e baixo overhead.
- **Drizzle ORM:** ORM moderno, tipado de ponta a ponta, para comunicação com o banco de dados.
- **PostgreSQL:** Banco de dados relacional robusto para persistência dos dados.
- **Redis:** Banco de dados em memória utilizado para duas finalidades: Cache distribuído e gerenciamento de filas.
- **BullMQ:** Sistema de filas rápido e confiável baseado em Redis para processamento assíncrono (Workers).
- **Zod:** Biblioteca para validação de esquemas, payloads e variáveis de ambiente.
- **Swagger / OpenAPI:** Documentação interativa gerada automaticamente a partir dos schemas Zod via `fastify-type-provider-zod`.
- **Docker & Docker Compose:** Utilizado para conteinerizar a aplicação e subir toda a infraestrutura (Node, Postgres, Redis) com um único comando.
<br></br>

## RFs (Requisitos Funcionais)

- [✅] Deve ser possível cadastrar um novo usuário e realizar login (Autenticação JWT).
- [✅] Deve ser possível criar uma nova publicação (Post).
- [✅] Deve ser possível listar os posts em um Feed paginado.
- [✅] Deve ser possível visualizar os detalhes de um post específico pelo ID.
- [✅] Deve ser possível curtir ou descurtir um post.
- [✅] Deve ser possível adicionar comentários a um post.
- [✅] Deve ser possível visualizar um ranking dos top 10 posts com mais curtidas.
<br></br>

## RNFs (Requisitos Não-Funcionais)

- [✅] Os dados relacionais (usuários, posts, likes, comentários) precisam estar persistidos em um banco PostgreSQL.
- [✅] A aplicação deve ser totalmente conteinerizada com Docker.
- [✅] Operações que não requerem resposta imediata (salvar like e comentário) devem ser delegadas para processamento assíncrono (Filas/Workers).
- [✅] A listagem de posts deve possuir uma estratégia de Cache Distribuído para diminuir a carga no banco de dados.
- [✅] A API deve possuir documentação interativa acessível via rota `/docs`.
<br></br>

## Rotas da Aplicação (Resumo)

A documentação interativa e completa (com payloads, schemas e testes ao vivo) pode ser acessada rodando o projeto e visitando a rota:
👉 **`GET /docs`**

Abaixo, um resumo das rotas principais:

### Autenticação
- **`POST /users/register`**: Registra um novo usuário na rede social.
- **`POST /users/auth`**: Realiza o login e devolve o token JWT.

### Posts
- **`POST /posts`**: Cria um novo post. *(Requer JWT)*
- **`GET /posts`**: Retorna o feed de posts. Aceita query params `?page=1&limit=10`. (Utiliza Cache via Redis).
- **`GET /posts/ranking`**: Retorna o top 10 posts mais curtidos.
- **`GET /posts/:id`**: Retorna os detalhes de um post específico. *(Requer JWT)*

### Interações
- **`POST /posts/:id/like`**: Adiciona ou remove uma curtida de um post. O processamento é delegado para a fila do BullMQ. *(Requer JWT)*
- **`POST /posts/:id/comment`**: Adiciona um comentário a um post. O processamento é delegado para a fila do BullMQ. *(Requer JWT)*
<br></br>

## Problemas Encontrados e Como Foram Resolvidos

### 1. Gargalo de Performance no Feed (Listagem de Posts)
- **Problema:** A rota de listar posts (`GET /posts`) faz `JOINs` complexos para agregar likes e comentários. Se muitos usuários abrissem o app ao mesmo tempo, o PostgreSQL sofreria com alto consumo de CPU e as requisições ficariam lentas.
- **Solução:** Implementação do padrão **Cache-Aside** utilizando o **Redis** e **Paginação**. Quando o Feed é requisitado, a API busca primeiro no Redis (retornando em milissegundos). Se não existir (Cache Miss), busca no banco e salva no Redis por 60 segundos. Quando um novo post é criado, o cache da "Página 1" é proativamente invalidado para manter o feed atualizado.

### 2. Bloqueio do Event Loop com Múltiplas Interações
- **Problema:** Em redes sociais, as ações de "Curtir" e "Comentar" ocorrem aos milhares por segundo. Fazer a inserção síncrona no banco de dados para cada like faria a requisição HTTP demorar e bloquearia as threads do Node.js.
- **Solução:** Adoção de uma **Arquitetura Orientada a Eventos / Filas**. Quando o usuário curte ou comenta, a API apenas valida os dados e envia uma mensagem para a fila do **BullMQ** (apoiado pelo Redis), respondendo `202 Accepted` imediatamente para o cliente. Um Worker separado consome essa fila em background e efetiva a gravação no PostgreSQL de forma segura e com suporte a tentativas de falha (retries).

### 3. Duplicação de Código entre Validação e Documentação
- **Problema:** Manter schemas do Zod para validar requisições e ter que escrever tudo de novo no formato JSON/YAML do OpenAPI (Swagger) gera retrabalho e inconsistência.
- **Solução:** Uso do `fastify-type-provider-zod`. Este *provider* intercepta as rotas do Fastify, lê as validações Zod nativas do código e gera todo o Swagger UI de forma **100% automática e dinâmica**, garantindo que a documentação nunca fique desatualizada em relação ao código real.
<br></br>

## Como rodar o projeto localmente

1. Clone o repositório.
2. Crie uma cópia do arquivo `.env.example` para `.env` (se existir) ou apenas confie nas variáveis padrão fornecidas no `docker-compose.yml`.
3. Suba toda a infraestrutura com o Docker:
   ```bash
   docker compose up --build
   ```
4. A API estará disponível em `http://localhost:3333`.
5. Acesse a documentação pelo navegador em `http://localhost:3333/docs`.
