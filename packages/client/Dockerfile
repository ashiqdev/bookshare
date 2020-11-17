FROM node:14-slim

WORKDIR /usr/src/app

COPY ./package.json ./
 
RUN yarn install

COPY . .

EXPOSE 1234

CMD ["yarn", "dev"]