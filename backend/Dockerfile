FROM node:20-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
COPY backend/package.json ./backend/package.json
RUN npm install
COPY . .
WORKDIR /app/backend
RUN npx prisma generate && npm run build
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && npm run start"]
