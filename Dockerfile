# syntax=docker/dockerfile:1

FROM node:14.18.2

ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install -g typescript

RUN npm install -g nodemon

RUN npm install -g ts-node

RUN npm install --production

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start:prod" ]