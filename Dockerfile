FROM node:12

WORKDIR /urs/src/app

copy package*.json ./

RUN npm install
RUN npm install nodemon -g

COPY . .

EXPOSE 8080

CMD ["nodemon", "index.js"]
