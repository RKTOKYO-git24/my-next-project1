// /home/ryotaro/dev/mnp-dw-20250821/payload/app/src/payload.config.ts

// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { News }  from './collections/News';

// 既存: import { Media } from './collections/Media'（テンプレ由来）
// もし上の Media が別パスなら揃えてください（src/collections/media.collection など）

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, News ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),  // この設定が入っているので開発時に再ビルドすれば自動で上書きされます。
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],

  serverURL: process.env.SERVER_URL || 'http://localhost:3100',
    cors: [
    'http://localhost:3000',  // フロントのNext.js
    'http://localhost:3100',  // Payload自身
  ],
  csrf: [
    'http://localhost:3000',
    'http://localhost:3100',
  ],
})

