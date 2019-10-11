FROM node:10
RUN mkdir -p /src
WORKDIR /src/app

COPY package*.json /src/
RUN npm install

COPY . /src
EXPOSE 8080

CMD [ "npm", "start" ]