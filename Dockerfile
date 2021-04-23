FROM node:12.13-alpine as build-img

# set the working directory inside the container
WORKDIR /src

# copy the package.json files
COPY package*.json ./

# install only the development dependencies
RUN npm install --only=development

# copy everything into the working directory of the container
COPY . .

RUN npm run build



FROM node:12.13-alpine

ARG NODE_ENV=dev
ENV NODE_ENV=${NODE_ENV}

WORKDIR /src

COPY package*.json ./

RUN npm install --only=production

COPY . .

COPY --from=build-img /src/dist ./dist
COPY --from=build-img /src/env ./env

EXPOSE 3000

CMD ["node", "dist/main"]
