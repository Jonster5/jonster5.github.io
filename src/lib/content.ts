import { marked } from "marked";
import DOMPurify from "dompurify";
import { CONTENT_URL_BASE } from "../static";

async function fetchFile(url: URL): Promise<string> {
	const request = await fetch(url);
	const text = await request.text();
	return text;
}

async function mdToHtml(md_string: string): Promise<string> {
	const html = await marked.parse(md_string);
	const clean_html = DOMPurify.sanitize(html);
	return clean_html;
}

export async function getContent(file: string): Promise<string> {
	const content_url = new URL(file, CONTENT_URL_BASE);

	const raw_content = await fetchFile(content_url);
	const html = await mdToHtml(raw_content);

	return html;
}
