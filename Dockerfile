FROM node:18-alpine

WORKDIR /timedtask-server

COPY . .

RUN npm install

EXPOSE 4000

CMD [ "npm", "run", "dev" ]