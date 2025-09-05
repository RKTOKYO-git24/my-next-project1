# /home/ryotaro/dev/mnp-dw-20250821/payload/app/Dockerfile

FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install --production

COPY . .

# PayloadCMS (Next.js admin 含む) をビルド
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start"]
