FROM node:lts-alpine3.17

WORKDIR /usr/src/app

RUN npm install -g yarn

COPY package.json yarn.lock* ./

RUN yarn install --frozen-lockfile

COPY . .

CMD ["sh", "-c", "yarn db:migrate && yarn dev"]