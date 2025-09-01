// /payload/app/src/collections/News.ts
import type { CollectionConfig, Access, Where } from 'payload';

const publicRead: Access = ({ req }) => {
  // ログイン済みは全件OK
  if (req.user) return true;

  // 未ログインは公開記事のみ
  const where: Where = {
    and: [
      { status:   { equals: 'published' } },
      { category: { not_equals: 'private' } },
    ],
  };
  return where; // ✅ Where をそのまま返す
};

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  admin: { useAsTitle: 'title' },

  access: {
    read: publicRead, // ✅ Access 型の関数を割り当て
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'update',
      options: [
        { label: 'Technology', value: 'technology' },
        { label: 'Japan',      value: 'japan' },
        { label: 'U.S.A.',     value: 'usa' },
        { label: 'Update',     value: 'update' },
        { label: 'Private',    value: 'private' },
      ],
    },
    { name: 'publishedDate', type: 'date' },
    { name: 'excerpt',       type: 'textarea' },
    { name: 'content',       type: 'richText' },
    { name: 'externalId',    type: 'text' },
    { name: 'thumbnail',     type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft',     value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};