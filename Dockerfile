FROM node:10.15

LABEL MAINTAINER Zhora Khachatryan <jor.khachatryan@inbox.ru>

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]