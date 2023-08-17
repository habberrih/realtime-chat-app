FROM node:18-alpine AS development

WORKDIR /habberrih/src/app

COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000


FROM node:18-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /habberrih/src/app

COPY --from=development /habberrih/src/app/ .

EXPOSE 3000

CMD [ "node", "dist/main" ]