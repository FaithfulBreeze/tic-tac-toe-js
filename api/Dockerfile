FROM node:latest
WORKDIR /app
COPY package*.json .
RUN npm i
COPY . .
EXPOSE 3030
CMD ["npm", "run", "start"]