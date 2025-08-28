import { CollectionConfig } from 'payload';

export const News: CollectionConfig = {
  slug: 'news',
  labels: { singular: 'News', plural: 'News' },
  admin: { useAsTitle: 'title' },
  access: { read: () => true }, // 公開読み取り
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'update',
      options: [
        { label: 'Press Release', value: 'press' },
        { label: 'Important',     value: 'important' },
        { label: 'Update',        value: 'update' },
      ],
    },
    { name: 'publishedDate', type: 'date', required: true },
    { name: 'excerpt', type: 'textarea' },
    { name: 'content', type: 'richText' },
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


