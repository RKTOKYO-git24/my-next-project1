# プロジェクト ドキュメント

このフォルダには、開発・運用に関する情報をまとめています。  
新しく参加するメンバーが環境を構築し、アーキテクチャを理解できることを目的としています。

---

## 構築環境

- **フロントエンド**: Next.js (TypeScript)  
- **ホスティング**: Vercel  
- **バックエンド**: Node.js (Express) + Docker コンテナ  
- **データベース**: MongoDB Atlas  
- **外部サービス**: HubSpot API（CRM連携）  
- **開発環境**: Docker Compose によるローカル統一環境  

---

## 環境構築手順

```bash
# リポジトリをクローン
git clone <repository-url>
cd <repository-name>

# 環境変数を設定 (.env ファイルをコピーして編集)
cp .env.example .env

# Docker コンテナ起動
docker compose up --build

# フロントエンド開発 (ホットリロード)
npm run dev
Docker 設定
backend : Node.js サーバー

ポート: 3001

frontend : Next.js

ポート: 3000

db : MongoDB (ローカルテスト用)

ポート: 27017

docker-compose.yml にて各サービスを定義し、ネットワークを統一しています。
本番では MongoDB Atlas を利用し、ローカルの db コンテナは開発用に限定。

使用している API
HubSpot API

CRM データとの連携

認証は API Key or OAuth (環境変数で管理)

主に顧客管理・問い合わせフローで利用

自作 API (backend)

認証・ユーザー管理

データ処理 (MongoDB Atlas とのやり取り)

ポート構成 (開発環境)
http://localhost:3000 → フロントエンド (Next.js)

http://localhost:3001 → バックエンド API (Express)

mongodb://localhost:27017 → ローカル DB (MongoDB)

目指している構成 (インフラ)
最終的には以下のようなモダンな構成を目指しています：

css
コードをコピーする
[User] 
   │
   ▼
[Vercel (Frontend)]
   │
   ▼
[Akamai Cloud (Edge / CDN)]
   │
   ▼
[Backend API (Dockerized, Node.js)]
   │
   ▼
[MongoDB Atlas (Managed DB)]
   │
   └── [HubSpot API Integration]
Vercel: フロントエンドを高速にデプロイ

Akamai Cloud: Edge 配信・セキュリティ強化（導入予定）

MongoDB Atlas: スケーラブルなマネージド DB

HubSpot: 顧客データや営業フローの基盤

今後追加予定のドキュメント
Contributing ガイドライン

API 仕様書 (Swagger / OpenAPI)

インフラ構成図 (Terraform / IaC 化)

モニタリング / ログ収集の設計