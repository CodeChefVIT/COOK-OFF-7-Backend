FROM node:16-alpine

WORKDIR /usr
COPY package.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a
RUN yarn install
RUN yarn run build


FROM node:16-alpine
WORKDIR /usr
COPY package.json ./
RUN yarn install --production=true

COPY --from=0 /usr/dist .

CMD ["node", "index.js"]