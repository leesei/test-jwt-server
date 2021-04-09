FROM node:lts-alpine

ENV NODE_ENV=production
ADD . /

RUN npm install --production
RUN npm run build

EXPOSE 8000

CMD [ "npm", "run", "start" ]
