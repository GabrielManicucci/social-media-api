FROM node:20-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm build

EXPOSE 3333

CMD ["sh", "-c", "pnpm db:migrate && node build/server.js"]