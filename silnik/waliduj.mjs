import fs from "node:fs";

const file = process.argv[2];
if (!file) {
  console.error("Użycie: node silnik/waliduj.mjs content/templates/warsztat.json");
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(file, "utf8"));
const errors = [];

function required(path, value) {
  if (value === undefined || value === null || String(value).trim() === "") errors.push(`Brak pola: ${path}`);
}

required("meta.title", data.meta?.title);
required("meta.description", data.meta?.description);
required("business.name", data.business?.name);
required("business.phone", data.business?.phone);
required("business.address", data.business?.address);
required("hero.headline", data.hero?.headline);
required("hero.lead", data.hero?.lead);
required("hero.image", data.hero?.image);

if (!Array.isArray(data.services) || ![4, 8].includes(data.services.length)) errors.push("services musi mieć 4 albo 8 pozycji.");
for (const [index, service] of (data.services || []).entries()) {
  required(`services.${index}.name`, service.name);
  required(`services.${index}.description`, service.description);
  required(`services.${index}.price`, service.price);
}

if (!Array.isArray(data.faq) || data.faq.length < 3) errors.push("faq musi mieć minimum 3 pytania.");
if (JSON.stringify(data).match(/do potwierdzenia z klientem|DO POTWIERDZENIA|placeholder|lorem/i)) errors.push("Treść zawiera roboczy placeholder.");

if (errors.length) {
  console.error(errors.map((error) => `BLAD ${error}`).join("\n"));
  process.exit(1);
}

console.log("OK - dane szablonu są kompletne.");
