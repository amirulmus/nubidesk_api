FROM node:lts-alpine

ARG mode
ENV ENV_MODE ${mode}
ENV APP_ROOT /src

RUN mkdir ${APP_ROOT}
WORKDIR ${APP_ROOT}
ADD . ${APP_ROOT}

RUN npm install

EXPOSE 3000
CMD npm run start-${ENV_MODE}