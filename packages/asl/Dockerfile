FROM quay.io/ukhomeofficedigital/nodejs-base:v8

COPY package.json /app/package.json
RUN npm install --production --no-optional
COPY . /app

USER nodejs

CMD node index.js
