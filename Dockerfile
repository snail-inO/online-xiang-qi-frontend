FROM node:18.7.0-alpine

WORKDIR /app

COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]

RUN npm install 

COPY ./src ./src/
COPY ./public ./public

ENTRYPOINT ["npm", "start"]