// app/src/collections/Media.ts
import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: { read: () => true },
  fields: [{ name: 'alt', type: 'text', required: true }],
  upload: {
    staticDir: 'media',   // 物理パス: /app/media
    // staticURL はこのバージョンではコレクション側に無い
  },
}
