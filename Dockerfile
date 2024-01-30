# syntax=docker/dockerfile:1

FROM node:20.11.0
WORKDIR /
COPY . ./
WORKDIR /backend
RUN npm install
RUN npm run build
ENV NODE_ENV=production
CMD ["node", "build/server.js"]
EXPOSE 3000