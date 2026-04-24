import type { FangyuSection } from "@/lib/fangyu-data";

export const slugByTitle: Record<string, string> = {
  历代州域形势纪要序: "zhouyu-xingshi",
  北直方舆纪要序: "beizhi",
  南直方舆纪要序: "nanzhi",
  山东方舆纪要序: "shandong",
  山西方舆纪要序: "shanxi",
  河南方舆纪要序: "henan",
  陕西方舆纪要序: "shaanxi",
  四川方舆纪要叙: "sichuan",
  湖广方舆纪要序: "huguang",
  江西方舆纪要叙: "jiangxi",
  浙江方舆纪要叙: "zhejiang",
  福建方舆纪要叙: "fujian",
  广东方舆纪要叙: "guangdong",
  广西方舆纪要叙: "guangxi",
  云南方舆纪要序: "yunnan",
  贵州方舆纪要叙: "guizhou",
  川渎异同序: "chuandu-yitong",
};

export function sectionSlug(title: string, order: number) {
  return slugByTitle[title] ?? `${String(order).padStart(2, "0")}-${title.replace(/[^\p{Letter}\p{Number}]+/gu, "-")}`;
}

export function getSectionPath(section: Pick<FangyuSection, "slug">) {
  return `/sections/${section.slug}`;
}
