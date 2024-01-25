# syntax=docker/dockerfile:1

FROM node:18-alpine
WORKDIR /
COPY . ./
WORKDIR /backend
RUN npm install
RUN npm run build
CMD ["node", "build/server.js"]
EXPOSE 3000