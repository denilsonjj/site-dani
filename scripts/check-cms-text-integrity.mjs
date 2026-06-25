import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

const mojibakePattern = /(?:\u00c3|\u00c2|\u00e2\u20ac|\u00e2\u201a|\u00e2\u2020|\ufffd)/u;
const brokenPortuguesePattern =
  /\b(?:endere\?o|informa\?\?es|espec\?ficas|necess\?rias|servi\?o|conte\?do|configura\?\?o|sess\?es?|inscri\?\?o|energ\?tica|formul\?rio|dist\?ncia|orienta\?\?o|avalia\?\?o|restaura\?\?o|harmoniza\?\?o|liberta\?\?es|padr\?es|eletr\?nico|direcci\?n)\b/iu;

const tables = [
  {
    columns: ["title", "summary", "description", "duration", "price_label", "badge"],
    identifiers: ["id", "slug", "product_id"],
    name: "content_services",
  },
  {
    columns: ["title", "excerpt", "body", "reading_time"],
    identifiers: ["id", "slug"],
    name: "blog_posts",
  },
  {
    columns: ["alt"],
    identifiers: ["id", "slot"],
    name: "media_assets",
  },
  {
    columns: ["title", "body"],
    identifiers: ["id", "key"],
    name: "legal_documents",
  },
  {
    columns: ["label", "help_text"],
    identifiers: ["id", "key"],
    name: "service_intake_fields",
  },
];

function loadEnv(file) {
  const envPath = path.resolve(file);
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const index = trimmed.indexOf("=");
    if (index === -1) continue;

    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    process.env[key] ||= value;
  }
}

function inspectValue(value, pathParts, findings) {
  if (value === null || value === undefined) return;

  if (typeof value === "string") {
    if (mojibakePattern.test(value) || brokenPortuguesePattern.test(value)) {
      findings.push({
        path: pathParts.join("."),
        value,
      });
    }
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => inspectValue(item, [...pathParts, String(index)], findings));
    return;
  }

  if (typeof value === "object") {
    for (const [key, nestedValue] of Object.entries(value)) {
      inspectValue(nestedValue, [...pathParts, key], findings);
    }
  }
}

loadEnv(".env");

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.log("CMS text integrity check skipped: Supabase admin env vars are not configured.");
  process.exit(0);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    persistSession: false,
  },
});

const findings = [];

for (const table of tables) {
  const { data, error } = await supabase
    .from(table.name)
    .select([...table.identifiers, ...table.columns].join(","));

  if (error) {
    findings.push({
      path: `${table.name}.query`,
      value: error.message,
    });
    continue;
  }

  for (const row of data || []) {
    const rowId = row.key || row.slot || row.slug || row.product_id || row.id;
    for (const column of table.columns) {
      inspectValue(row[column], [table.name, String(rowId), column], findings);
    }
  }
}

if (findings.length) {
  console.error("CMS text integrity check failed. Possible corrupted CMS text found:\n");
  for (const finding of findings) {
    console.error(`${finding.path}: ${finding.value}`);
  }
  process.exit(1);
}

console.log("CMS text integrity check passed.");
