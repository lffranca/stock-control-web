FROM node:12.13.1-alpine AS build

RUN apk add --no-cache git

RUN npm install -g @quasar/cli

COPY . /app

WORKDIR /app

RUN npm install
RUN npm rebuild node-sass

RUN quasar build

# ALPINE
FROM node:12.13.1-alpine

RUN apk add --no-cache git
RUN npm install -g serve

RUN mkdir /app
COPY --from=build /app/dist/spa /app

WORKDIR /app

ADD ./exec.sh /app/exec.sh
RUN chmod +x ./exec.sh

EXPOSE 80

CMD [ "./exec.sh" ]
