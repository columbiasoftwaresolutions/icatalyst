import { cp, mkdir, readdir, rm } from "node:fs/promises";

// Copy only public web files. Repository notes and credentials never enter dist.
await rm("dist", { recursive: true, force: true });
await mkdir("dist");
for (const file of await readdir(".")) {
  if (file.endsWith(".html")) await cp(file, `dist/${file}`);
}
for (const directory of ["assets", "lib", "pages"]) {
  await cp(directory, `dist/${directory}`, { recursive: true });
}
console.log("Cloudflare static files prepared in dist/");
