FROM node:0.12
ADD . /app
WORKDIR /app
RUN npm install

ENV PORT 3000
EXPOSE 3000

CMD node api.js