FROM node:22 AS development
WORKDIR /home/node/app
ENV NODE_ENV="development"
COPY package*.json ./
RUN npm i -g pm2 && npm i
