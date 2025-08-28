import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,   // ← ログイン有効化
  admin: { useAsTitle: 'email' },
  useAsTitle: 'email',
  access: {
    // ログイン済みなら自分のデータだけ読めるように制御したい場合
    read: ({ req }) => {
      return !!req.user;  // とりあえず「ログイン済みならOK」
    },
  },
  fields: [
    // email はデフォルトで auth 有効化すると自動追加されるので省略可
    // 追加したい項目があればここに足す
    // 例: role（会員 / 管理者の区別）
    // {
    //   name: 'role',
    //   type: 'select',
    //   defaultValue: 'member',
    //   options: [
    //     { label: 'Member', value: 'member' },
    //     { label: 'Admin', value: 'admin' },
    //   ],
    // },
  ],
}
