FROM node:10-alpine as build
WORKDIR /usr/src/app

COPY src/input-material-scanner-connector/package-prod.json ./package.json
RUN npm install --production
COPY build/input-material-scanner-connector/. .

FROM node:10-alpine
COPY --from=build /usr/src/app /
CMD ["node", "input-material-scanner-connector/index.js"]
