FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY frontend/package.json ./frontend/package.json
RUN npm install
COPY . .
WORKDIR /app/frontend
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
