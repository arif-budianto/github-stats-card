FROM node:22-alpine

WORKDIR /app

RUN apk add --no-cache git

RUN git clone --depth 1 https://github.com/anuraghazra/github-readme-stats.git && \
    cd github-readme-stats && \
    npm install --omit=dev --ignore-scripts && \
    cd ..

COPY package.json .
RUN npm install --omit=dev --ignore-scripts

COPY server.js .

EXPOSE 3000

CMD ["node", "server.js"]
