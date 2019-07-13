# build environment
FROM node:alpine

WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json /app/package.json
RUN npm install --silent

COPY . /app
CMD npm start