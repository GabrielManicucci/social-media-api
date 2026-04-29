FROM node:lts-alpine3.17

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
COPY .npmrc ./

RUN pnpm install

COPY . .

CMD ["sh", "-c", "pnpm db:deploy && pnpm build && pnpm start:prod"]