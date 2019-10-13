FROM node:10
RUN mkdir -p /src	
WORKDIR /src

COPY package.json /src
COPY package-lock.json /src
RUN npm install

COPY . /src
EXPOSE 8080

RUN apt-get update
RUN apt-get -y install gfortran
RUN gfortran -o program/sa-linux-exec program/FrameAnalysis.f95

CMD [ "npm", "start" ]