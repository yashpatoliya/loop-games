import sharp from "sharp";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const dir = dirname(fileURLToPath(import.meta.url));
const out = join(dir, "..", "public", "icons");

const regular = readFileSync(join(dir, "icon-source.svg"));
const maskable = readFileSync(join(dir, "icon-maskable-source.svg"));

await sharp(regular).resize(192, 192).png().toFile(join(out, "icon-192.png"));
await sharp(regular).resize(512, 512).png().toFile(join(out, "icon-512.png"));
await sharp(regular)
  .resize(180, 180)
  .png()
  .toFile(join(out, "apple-touch-icon.png"));
await sharp(maskable)
  .resize(192, 192)
  .png()
  .toFile(join(out, "icon-maskable-192.png"));
await sharp(maskable)
  .resize(512, 512)
  .png()
  .toFile(join(out, "icon-maskable-512.png"));

console.log("done");
