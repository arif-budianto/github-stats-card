FROM node:22-alpine

WORKDIR /app

COPY package.json .
RUN npm install --omit=dev --ignore-scripts

COPY server.js .
COPY fetcher.js .
COPY cards/ ./cards/

EXPOSE 3000

CMD ["node", "server.js"]
