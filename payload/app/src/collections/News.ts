// /home/ryotaro/dev/mnp-dw-20250821/payload/app/src/collections/News.ts

import type { CollectionConfig } from 'payload';

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  admin: { useAsTitle: 'title' },

  access: {
  read: ({ req }) => {
    const isLoggedIn = !!req.user;

    if (isLoggedIn) {
      return true;
    }

    // PayloadのWhere条件はフィールド名ごとに書く
    return {
      where: {
        status: { equals: 'published' },
        category: { not_equals: 'private' },
      },
    };
  },
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
        { label: 'Japan', value: 'japan' },
        { label: 'U.S.A.', value: 'usa' },
        { label: 'Update', value: 'update' },
        { label: 'Private', value: 'private' },
      ],
    },
    { name: 'publishedDate', type: 'date' },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
    { name: 'externalId', type: 'text' }, // microCMSのID保持（冪等化に使う）
    { name: 'thumbnail', type: 'upload', relationTo: 'media' },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'published',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' },
      ],
    },
  ],
};
