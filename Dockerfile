FROM node:12-alpine

RUN mkdir /usr/game-lobby

WORKDIR /usr/game-lobby

COPY package.json ./
COPY package-lock.json ./

COPY . .

RUN npm i

EXPOSE 3333

CMD ["npm", "run", "dev"]