FROM node:18-alpine

WORKDIR /app

# Copy package files and install
COPY package.json package-lock.json* ./
RUN npm install

# Copy source and build
COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start-server"]
