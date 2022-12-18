FROM node:16.18.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN npm install 

COPY ./src ./src/
COPY ./public ./public

ENTRYPOINT ["npm", "start"]