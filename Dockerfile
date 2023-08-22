# Build layer
FROM node:lts-alpine AS build
RUN mkdir -p /usr/knowledge-knight-src/
WORKDIR /usr/knowledge-knight-src/
COPY package.json /usr/knowledge-knight-src/
RUN npm install
COPY . /usr/knowledge-knight-src/
RUN npm run build

# Image layer
FROM node:lts-alpine

ARG DISCORD_TOKEN
ARG DB_URL
ARG CLIENT_ID
ARG TZ

ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV DB_URL=${DB_URL}
ENV CLIENT_ID=${CLIENT_ID}
ENV TZ=${TZ}

ENV NODE_ENV=production

RUN mkdir -p /usr/knowledge-knight
WORKDIR /usr/knowledge-knight
COPY package.json /usr/knowledge-knight/
RUN npm install --omit=dev
COPY --from=build /usr/knowledge-knight-src/dist /usr/knowledge-knight

CMD ["npm", "run", "start:prod"]
