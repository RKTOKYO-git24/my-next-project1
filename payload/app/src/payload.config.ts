// /payload/app/src/payload.config.ts
import { buildConfig } from 'payload';
import { fileURLToPath } from 'url';
import path from 'path';
import sharp from 'sharp';

import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { News } from './collections/News';
import { Members } from "./collections/Members";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  // 管理画面
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },

  // 使用コレクション
  collections: [Users, Media, News, Members],

  // リッチテキスト（Lexical）
  editor: lexicalEditor(),

  // サーバーURL（メディアの絶対URL組み立てにも使われます）
  serverURL: process.env.SERVER_URL || 'http://localhost:3100',

  // セキュリティ
  secret: process.env.PAYLOAD_SECRET || '',

  // CORS / CSRF（Next.dev / 自身を許可）
  cors: [
    'http://localhost:3000',
    'http://localhost:3100',
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3100',
  ],

  // 画像処理
  sharp,

  // DB（MongoDB）
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),

  // 型出力
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
