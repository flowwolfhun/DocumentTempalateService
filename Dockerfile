FROM node:current-alpine

ENV NODE_ENV=production
EXPOSE 3000
EXPOSE 3030
RUN mkdir /app
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install --production

COPY . .

CMD ["npm", "start"]
