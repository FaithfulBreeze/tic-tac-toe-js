FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 6060
CMD ["npm", "run", "start"]