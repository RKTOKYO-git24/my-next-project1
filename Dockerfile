# /home/ryotaro/dev/mnp-dw-20250821/Dockerfile
FROM node:20

WORKDIR /app

COPY package*.json ./
RUN npm install

ENV WATCHPACK_POLLING=true

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
