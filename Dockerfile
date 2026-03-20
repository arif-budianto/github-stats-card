FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

RUN git clone --depth 1 https://github.com/anuraghazra/github-readme-stats.git

COPY package.json .
RUN npm install

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
