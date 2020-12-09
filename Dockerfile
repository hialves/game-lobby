FROM node:12-alpine

RUN mkdir /usr/game-lobby

WORKDIR /usr/game-lobby

COPY package.json ./
COPY package-lock.json ./

COPY . .

RUN npm i

RUN npm uninstall bcryptjs
RUN npm install bcryptjs

EXPOSE 3333

CMD ["npm", "run", "dev"]