# build stage
FROM node:lts-alpine as build-stage

WORKDIR /temp

# Copying package files and installing dependencies
COPY package.json yarn.lock .
RUN yarn install --registry=https://registry.npmmirror.com/ --frozen-lockfile && yarn cache clean --force

# Copying source files and building the application
COPY . .
RUN yarn run build

# production stage
FROM node:lts-alpine as production-stage

WORKDIR /app

# Copying only necessary files from build-stage
COPY --from=build-stage /temp/dist ./dist
COPY --from=build-stage /temp/package.json ./package.json
COPY --from=build-stage /temp/yarn.lock ./yarn.lock
COPY --from=build-stage /temp/tsconfig.json ./tsconfig.json

# Installing only production dependencies
RUN yarn install --registry=https://registry.npmmirror.com/ --only=production && yarn cache clean --force

# Exposing the right port
EXPOSE 3005

# Starting the application
CMD [ "yarn", "run", "start:prod" ]
