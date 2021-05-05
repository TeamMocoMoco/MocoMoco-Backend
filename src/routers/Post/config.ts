export type Meeting = "온라인" | "오프라인";
export const userInfo = "name role userImg";
export function keywordOption(keyword: string) {
  return { title: { $regex: keyword }, hashtag: { $regex: keyword } };
}
