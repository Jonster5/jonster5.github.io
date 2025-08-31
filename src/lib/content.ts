import { marked } from "marked";
import DOMPurify from "dompurify";
import { CONTENT_URL_BASE } from "./static";
import { ArkError, ArkErrors, type } from "arktype";

export async function fetchIndex(): Promise<SunshineIndex> {
	const index_url = new URL("./index.json", CONTENT_URL_BASE);
	const request = await fetch(index_url);
	const raw_json = await request.json();
	const json = SunshineIndex(raw_json);
	if (json instanceof ArkErrors) {
		throw json.toTraversalError();
	}

	return json;
}

export async function fetchContentFile(report: SunshineReport, key: number): Promise<string> {
	const path = `./${report.filename}`;
	const content_url = new URL(path, CONTENT_URL_BASE);

	const request = await fetch(content_url);
	const encrypted_bytes = await request.bytes();
	const bytes = encrypted_bytes.map((v) => v ^ key);
	const decoder = new TextDecoder("utf-8");
	const md_string = decoder.decode(bytes);

	const html = await marked.parse(md_string);
	const clean_html = DOMPurify.sanitize(html);

	return clean_html;
}

export function myHashFunction(input: string): number {
	function fib(n: number): number {
		let phi = (1 + Math.sqrt(5)) / 2;
		let asymp = Math.pow(phi, n) / Math.sqrt(5);

		return Math.round(asymp);
	}

	const codepoints = new Array(input.length);
	for (let i = 0; i < input.length; i++) {
		const codepoint = input.codePointAt(i);
		if (codepoint === undefined) {
			throw new Error(`No char at position ${i} in encryption key`);
		}

		codepoints[i] = codepoint * fib(i);
	}

	let hash = 0o3_14_2002;
	for (let i = 0; i < codepoints.length; i++) {
		hash += codepoints[i];
	}
	hash = hash % 256;

	return hash;
}

export const SunshineReport = type({
	type: "'major'",
	filename: "string",
});
export type SunshineReport = type.infer<typeof SunshineReport>;

export const SunshineIndex = type({
	timestamp: "number",
	keytest: "number[]",
	reports: SunshineReport.array(),
});
export type SunshineIndex = type.infer<typeof SunshineIndex>;
