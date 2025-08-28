# ~/dev/mnp-dw-20250821/payload/app/Dockerfile

FROM node:22-alpine

# Alpine でビルドに必要なツールを追加
RUN apk add --no-cache python3 make g++ wget busybox-extras

WORKDIR /usr/src/app

# 依存キャッシュ用に package.json をコピーして一度だけ npm install
COPY package*.json ./
RUN npm ci || npm install

# アプリ本体をコピー
COPY . .

EXPOSE 3000

# devモード（ホットリロード有効）
CMD ["npm", "run", "dev"]
