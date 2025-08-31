import { readdir } from "node:fs/promises";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (ENCRYPTION_KEY === undefined) {
	throw new Error("ENCRYPTION_KEY not defined");
}

const sunshine_dir = new URL("./sunshine-content/", import.meta.url);
const output_dir = new URL("./public/sunshine/", import.meta.url);

const key = myHashFunction(ENCRYPTION_KEY);
const keytest: number[] = "sunshine"
	.split("")
	.map((c) => c.charCodeAt(0)!)
	.map((v) => v ^ key);
const timestamp = Date.now();

const sunshine_dir_paths = await readdir(sunshine_dir);
const re_major = /.*\.major\.md/;
const reports: SunshineReport[] = await Promise.all(
	sunshine_dir_paths.map((path: string) => {
		if (re_major.test(path)) {
			return buildMajorReport(path);
		}

		throw new Error(`Invalid report: ${path}`);
	})
);

async function buildMajorReport(path: string): Promise<SunshineReport> {
	const file_url = new URL(path, sunshine_dir);
	const file = Bun.file(file_url);

	const bytes = await file.bytes();
	const encrypted_bytes = bytes.map((byte) => byte ^ key);

	const output_file_name = path.replace(/\.md$/, ".sunshine");
	const output_file_url = new URL(`./${output_file_name}`, output_dir);
	const output_file = Bun.file(output_file_url);

	if (await output_file.exists()) {
		await output_file.delete();
	}

	await Bun.write(output_file, encrypted_bytes);
	console.log(`Writing Major: ${output_file_name}`);

	return {
		type: "major",
		filename: output_file_name,
	} as SunshineReport;
}

const index_object: SunshineIndex = {
	keytest,
	timestamp,
	reports,
};

const index_string = JSON.stringify(index_object);

const index_url = new URL("./index.json", output_dir);
const index_file = Bun.file(index_url);

if (await index_file.exists()) {
	await index_file.delete();
}

await Bun.write(index_file, index_string);
console.log(`Writing index.json`);

type SunshineIndex = {
	timestamp: number;
	keytest: number[];
	reports: SunshineReport[];
};

type SunshineReport = {
	type: "major";
	filename: string;
};

function myHashFunction(input: string): number {
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
