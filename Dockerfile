# Build layer
FROM node:lts-alpine AS build
RUN mkdir -p /usr/know-it-all-src/
WORKDIR /usr/know-it-all-src/
COPY package.json /usr/know-it-all-src/
RUN npm install
COPY . /usr/know-it-all-src/
RUN npm run build

# Image layer
FROM node:lts-alpine

ARG DISCORD_TOKEN
ARG DB_URL
ARG CLIENT_ID

ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV DB_URL=${DB_URL}
ENV CLIENT_ID=${CLIENT_ID}

ENV NODE_ENV=production

RUN mkdir -p /usr/know-it-all
WORKDIR /usr/know-it-all
COPY package.json /usr/know-it-all/
RUN npm install --omit=dev
COPY --from=build /usr/know-it-all-src/dist /usr/know-it-all

CMD ["npm", "run", "start:prod"]
