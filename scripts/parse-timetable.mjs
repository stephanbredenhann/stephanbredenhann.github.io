import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const raw = readFileSync(join(root, "scripts", "timetable-export.tsv"), "utf8");

const DAYS = new Set(["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]);
const CAMPUSES = new Set(["HATFIELD", "GROENKLOOF"]);
const RE_MODULE = /^[A-Z]{3}\s?\d{3}[A-Z]?$/;
const RE_OFFERED = /^(S1|S2|Y|Q[1-4])$/;
const RE_GROUP = /^[A-Z]{1,2}\d{2}[A-Z]?$/;
const RE_LANG = /^[EA]$/;
const RE_TIME = /^\d{1,2}:\d{2} - \d{1,2}:\d{2}$/;
const RE_ACTIVITY = /^[A-Z]{1,2}P?\d+\/?$/;

const tokens = raw.split(/\r?\n|\t/).map((t) => t.trim()).filter((t) => t.length > 0);

const problems = [];
const records = [];

let i = 0;
let current = null;

function startRecord() {
  if (current) {
    const n = current.acts.length;
    if (current.days.length !== n || current.times.length !== n || current.venues.length !== n) {
      problems.push(`array length mismatch at ${current.module} ${current.offered} ${current.group}: act=${n} day=${current.days.length} time=${current.times.length} venue=${current.venues.length}`);
    }
  }
  if (current) records.push(current);
  const module = tokens[i];
  const offered = tokens[i + 1];
  const group = tokens[i + 2];
  const lang = tokens[i + 3];
  if (!RE_MODULE.test(module)) {
    problems.push(`bad module token "${module}" at token ${i}`);
  }
  current = {
    module,
    offered,
    group,
    lang,
    campus: "",
    prog: [],
    acts: [],
    days: [],
    times: [],
    venues: [],
  };
  i += 4;
}

let phase = "seek";

while (i < tokens.length) {
  const t = tokens[i];

  if (RE_MODULE.test(t) && i + 1 < tokens.length && RE_OFFERED.test(tokens[i + 1])) {
    startRecord();
    phase = "act";
    continue;
  }

  if (!current) { i++; continue; }

  switch (phase) {
    case "act":
      if (DAYS.has(t)) { phase = "day"; continue; }
      if (RE_ACTIVITY.test(t)) { current.acts.push(t.replace(/\/$/, "")); i++; continue; }
      problems.push(`unexpected token in act phase: "${t}" near ${current.module}`);
      i++;
      continue;
    case "day":
      if (RE_TIME.test(t)) { phase = "time"; continue; }
      if (DAYS.has(t)) { current.days.push(t); i++; continue; }
      problems.push(`unexpected token in day phase: "${t}" near ${current.module}`);
      i++;
      continue;
    case "time":
      if (CAMPUSES.has(t)) { phase = "campus"; continue; }
      if (RE_TIME.test(t)) { current.times.push(t); i++; continue; }
      phase = "venue";
      continue;
    case "venue":
      if (CAMPUSES.has(t)) { phase = "campus"; continue; }
      current.venues.push(t);
      i++;
      continue;
    case "campus":
      current.campus = t;
      phase = "prog";
      i++;
      continue;
    case "prog":
      current.prog.push(t);
      i++;
      continue;
    default:
      i++;
  }
}
if (current) records.push(current);

if (current) {
  const n = current.acts.length;
  if (current.days.length !== n || current.times.length !== n || current.venues.length !== n) {
    problems.push(`array length mismatch at ${current.module} ${current.offered} ${current.group}: act=${n} day=${current.days.length} time=${current.times.length} venue=${current.venues.length}`);
  }
}
if (current) records.push(current);

const missingCampus = records.filter((r) => !r.campus).length;
if (missingCampus) problems.push(`${missingCampus} records without campus`);

function typeOf(activity) {
  if (/^L/.test(activity)) return "L";
  if (/^T/.test(activity)) return "T";
  if (/^P/.test(activity)) return "P";
  return activity[0];
}

const modulesMap = new Map();

for (const r of records) {
  const code = r.module.replace(/\s+/g, " ");
  let mod = modulesMap.get(code);
  if (!mod) {
    mod = new Map();
    modulesMap.set(code, mod);
  }
  let off = mod.get(r.offered);
  if (!off) {
    off = { groups: new Map(), langs: new Set(), campuses: new Set() };
    mod.set(r.offered, off);
  }
  off.langs.add(r.lang);
  off.campuses.add(r.campus);

  let grp = off.groups.get(r.group);
  if (!grp) {
    grp = [];
    off.groups.set(r.group, grp);
  }

  for (let k = 0; k < r.acts.length; k++) {
    grp.push({
      d: DAYS.has(r.days[k]) ? [...DAYS].indexOf(r.days[k]) + 1 : r.days[k],
      s: r.times[k] ? r.times[k].split(" - ")[0] : "",
      e: r.times[k] ? r.times[k].split(" - ")[1] : "",
      a: typeOf(r.acts[k]),
      raw: r.acts[k],
      v: [r.venues[k]],
    });
  }
}

// merge identical slots into venue lists
const outModules = [];
for (const [code, offerings] of [...modulesMap.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  const outOfferings = [];
  for (const [offered, off] of [...offerings.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const groups = {};
    for (const [gid, meetings] of [...off.groups.entries()].sort((a, b) => a[0].localeCompare(b[0], undefined, { numeric: true }))) {
      const merged = [];
      const slotIndex = new Map();
      for (const m of meetings) {
        const key = `${m.d}|${m.s}|${m.e}|${m.a}`;
        if (!slotIndex.has(key)) {
          slotIndex.set(key, merged.length);
          merged.push({ d: m.d, s: m.s, e: m.e, a: m.raw, v: [] });
        }
        const slot = merged[slotIndex.get(key)];
        slot.a = slot.a === m.raw ? slot.a : `${slot.a}/${m.raw}`;
        for (const v of m.v) if (!slot.v.includes(v)) slot.v.push(v);
      }
      groups[gid] = merged.map(({ d, s, e, a, v }) => ({ d, s, e, a, v }));
    }
    outOfferings.push({
      offered,
      langs: [...off.langs].sort().join(""),
      campuses: [...off.campuses].sort(),
      groups,
    });
  }
  outModules.push({ code, offerings: outOfferings });
}

const totalMeetings = outModules.reduce((sum, m) => sum + m.offerings.reduce((s2, o) => s2 + Object.values(o.groups).reduce((s3, g) => s3 + g.length, 0), 0), 0);
const groupCount = outModules.reduce((sum, m) => sum + m.offerings.reduce((s2, o) => s2 + Object.keys(o.groups).length, 0), 0);

console.log(`modules:        ${outModules.length}`);
console.log(`raw records:    ${records.length}`);
console.log(`offerings:      ${outModules.reduce((s, m) => s + m.offerings.length, 0)}`);
console.log(`groups:         ${groupCount}`);
console.log(`merged slots:   ${totalMeetings}`);

if (problems.length) {
  console.log(`\nPROBLEMS (${problems.length}):`);
  for (const p of [...new Set(problems)].slice(0, 40)) console.log(" -", p);
  process.exitCode = 1;
} else {
  console.log("\nno parse problems detected");
}

writeFileSync(
    join(root, "timetable", "data.js"),
    "// Generated by scripts/parse-timetable.mjs from the UP timetable export. Do not edit by hand.\nwindow.TUKS_DATA = " + JSON.stringify({ generated: new Date().toISOString(), source: "UP Student Timetable Creator export", modules: outModules }) + ";\n"
);

console.log("wrote timetable/data.js");
