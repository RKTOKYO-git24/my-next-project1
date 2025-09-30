// /payload/app/src/collections/News.ts
import type { CollectionConfig, Access, Where } from 'payload';
import { lexicalEditor } from '@payloadcms/richtext-lexical';

const publicRead: Access = ({ req }) => {
  if (req.user) return true;

  const where: Where = {
    and: [
      { status:   { equals: 'published' } },
      { category: { not_equals: 'private' } },
    ],
  };
  return where;
};

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  admin: { useAsTitle: 'title' },

  access: {
    read: publicRead,
  },

  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'description', type: 'textarea' },
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
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),  // ✅ リッチテキスト
      required: false,
    },
    { name: 'externalId', type: 'text' },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true },
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
