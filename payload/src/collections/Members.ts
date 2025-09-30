import { CollectionConfig } from "payload";

export const Members: CollectionConfig = {
  slug: "members", // API では /api/members でアクセスできる
  labels: {
    singular: "Member",
    plural: "Members",
  },
  access: {
    read: () => true, // 公開読み取り可能
  },
  admin: {
    useAsTitle: "name", // 管理画面リストに表示されるタイトル
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      label: "名前",
    },
    {
      name: "position",
      type: "text",
      label: "役職・ポジション",
    },
    {
      name: "profile",
      type: "textarea",
      label: "プロフィール",
    },
    {
      name: "image",
      type: "upload",
      relationTo: "media", // 画像アップロード用コレクション
      label: "写真",
    },
  ],
};
