FROM node:11.14.0-alpine

RUN mkdir /app
WORKDIR /app

COPY package*.json /app
RUN yarn install

COPY . /app

EXPOSE 5000

CMD ["npm","start"]

