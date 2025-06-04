# Use official Node.js image as the base image
FROM node:16-alpine

WORKDIR /app

COPY ./package*.json ./
COPY ./.env ./

RUN npm install

COPY ./ /app/

EXPOSE 4000

# Run the application in development mode
CMD ["npm", "run", "dev"]
