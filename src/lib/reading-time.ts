/** 阅读时长估算：中文 350 字/分钟，英文 200 词/分钟 */
export function readingTime(body: string): number {
	const zh = (body.match(/[\u4e00-\u9fff]/g) ?? []).length;
	const en = (body.match(/[A-Za-z0-9]+/g) ?? []).length;
	return Math.max(1, Math.ceil(zh / 350 + en / 200));
}
