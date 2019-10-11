FROM node:10
RUN mkdir -p /src	
WORKDIR /src

COPY package.json /src
COPY package-lock.json /src
RUN npm install

COPY . /src
EXPOSE 8080

CMD [ "npm", "start" ]