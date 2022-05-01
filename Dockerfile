FROM node:16
RUN mkdir -p /src	
WORKDIR /src

COPY package.json /src
COPY package-lock.json /src
RUN npm install
COPY . /src

RUN apt-get update
RUN apt-get -y install gfortran