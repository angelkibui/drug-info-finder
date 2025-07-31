FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install  # Only include if you actually have dependencies
EXPOSE 8080
CMD ["node", "server.js"]
