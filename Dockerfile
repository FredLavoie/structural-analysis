# base image
FROM node:16

# set work directory
WORKDIR /src

# install dependencies
COPY package.json /src
COPY yarn.lock /src
RUN yarn install

# install gfortran
RUN apt-get update
RUN apt-get -y install gfortran

# copy project
COPY . /src

# build the fortran executable
RUN gfortran -o /src/program/sa-linux-exec /src/program/FrameAnalysis.f95

# start the node server
CMD yarn start