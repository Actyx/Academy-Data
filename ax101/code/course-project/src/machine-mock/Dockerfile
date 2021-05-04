FROM node:10-alpine as build
WORKDIR /usr/src/app

COPY src/machine-mock/package-prod.json ./package.json
RUN npm install --production
COPY build/machine-mock/. .

FROM node:10-alpine
COPY --from=build /usr/src/app /
CMD ["node", "machine-mock/index.js"]
