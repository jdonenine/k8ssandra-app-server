# syntax=docker/dockerfile:1

FROM node:16-slim as builder
WORKDIR /usr/src/app
RUN chown node:node ./
USER node
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY ./src ./src
COPY package.json package.json
COPY tsconfig.json tsconfig.json
RUN npm run build

FROM node:16-slim
WORKDIR /usr/app
RUN chown node:node ./
USER node
ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV
COPY package.json package-lock.json* ./
RUN npm ci && npm cache clean --force
COPY --from=builder /usr/src/app/build ./
EXPOSE 3000
CMD ["node", "index.js"]

