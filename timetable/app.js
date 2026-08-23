(function () {
    "use strict";

    var STORAGE_KEY = "tuks-timetable-v2";

    var DAY_NAMES = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

    // UP slots run half past to twenty past, so the grid is drawn on the half hour.
    var DAY_START = 7 * 60 + 30;
    var DAY_END = 18 * 60 + 30;
    var PX_PER_MIN = 0.95;
    var PRINT_HEIGHT_PX = 575;   // what fits above the fold on A4 landscape
    var printMode = false;
    var KIND_NAMES = { L: "Lecture", T: "Tutorial", P: "Practical" };
    var PALETTE = ["#4da3ff", "#a78bfa", "#34d399", "#fbbf24", "#f87171", "#22d3ee", "#f472b6", "#a3e635", "#fb923c", "#818cf8"];

    var SEMESTERS = [
        { id: "all", label: "All" },
        { id: "S1", label: "Semester 1" },
        { id: "S2", label: "Semester 2" },
        { id: "Y", label: "Year" },
        { id: "Q1", label: "Q1" },
        { id: "Q2", label: "Q2" },
        { id: "Q3", label: "Q3" },
        { id: "Q4", label: "Q4" }
    ];

    var DATA = null;
    var state = { semester: "all", picks: [], custom: [] };

    var els = {
        chips: document.getElementById("semester-chips"),
        search: document.getElementById("module-search"),
        results: document.getElementById("search-results"),
        picks: document.getElementById("picks"),
        emptyMsg: document.getElementById("sidebar-empty"),
        customForm: document.getElementById("custom-form"),
        clashBanner: document.getElementById("clash-banner"),
        grid: document.getElementById("grid"),
        boardEmpty: document.getElementById("board-empty"),
        printBtn: document.getElementById("print-btn"),
        shareBtn: document.getElementById("share-btn"),
        resetBtn: document.getElementById("reset-btn"),
        stamp: document.getElementById("print-stamp")
    };

    /* ---------- helpers ---------- */

    function normCode(s) { return s.replace(/\s+/g, " ").trim().toUpperCase(); }

    function toMinutes(hhmm) {
        var p = hhmm.split(":");
        return parseInt(p[0], 10) * 60 + parseInt(p[1], 10);
    }

    function fmtTime(mins) {
        return String(Math.floor(mins / 60)).padStart(2, "0") + ":" +
            String(mins % 60).padStart(2, "0");
    }

    // Snap outwards to the nearest half hour so the axis labels stay at :30.
    function floorHalf(m) { return Math.floor((m - 30) / 60) * 60 + 30; }
    function ceilHalf(m) { return Math.ceil((m - 30) / 60) * 60 + 30; }

    function sameSet(a, b) {
        return a.length === b.length && a.every(function (x) { return b.indexOf(x) !== -1; });
    }

    function kindOf(activityLetter) {
        return "LTP".indexOf(activityLetter) >= 0 ? activityLetter : "X";
    }

    function toast(msg) {
        var el = document.createElement("div");
        el.className = "toast";
        el.setAttribute("data-show", "true");
        el.textContent = msg;
        document.body.appendChild(el);
        setTimeout(function () { el.remove(); }, 2200);
    }

    function findModule(code) {
        return DATA.modules.find(function (m) { return m.code === code; }) || null;
    }

    function semesterLabel(id) {
        var found = SEMESTERS.find(function (s) { return s.id === id; });
        return found ? found.label : id;
    }

    function offeringMatches(offered, chip) {
        if (chip === "all") return true;
        if (chip === "S1") return offered === "S1" || offered === "Y";
        if (chip === "S2") return offered === "S2" || offered === "Y";
        return offered === chip;
    }

    /* ---------- persistence ---------- */

    function save() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (e) { /* private mode */ }
        try {
            history.replaceState(null, "", buildHash());
        } catch (e) { /* opaque origin, e.g. opened straight off disk */ }
    }

    function load() {
        var fromHash = readHash();
        if (fromHash) {
            state = fromHash;
            history.replaceState(null, "", location.pathname);
            return;
        }
        try {
            var raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                var parsed = JSON.parse(raw);
                if (parsed && Array.isArray(parsed.picks)) state = parsed;
            }
        } catch (e) { /* ignore */ }
    }

    function buildHash() {
        try {
            var b = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
            return "#t=" + b;
        } catch (e) { return ""; }
    }

    function readHash() {
        if (!location.hash || location.hash.indexOf("#t=") !== 0) return null;
        try {
            var s = decodeURIComponent(escape(atob(location.hash.slice(3))));
            var parsed = JSON.parse(s);
            if (parsed && Array.isArray(parsed.picks)) return parsed;
        } catch (e) { /* ignore */ }
        return null;
    }

    /* ---------- resolution ---------- */

    function getOffering(pick) {
        var mod = findModule(pick.code);
        if (!mod) return null;
        return mod.offerings.find(function (o) { return o.offered === pick.offered; }) || mod.offerings[0] || null;
    }

    function groupKinds(groups, gid) {
        var set = {};
        (groups[gid] || []).forEach(function (mt) { set[kindOf(mt.a[0])] = true; });
        return set;
    }

    // Which group ids offer a given kind within this offering?
    function groupsWithKind(groups, kind) {
        return Object.keys(groups).filter(function (gid) {
            return (groups[gid] || []).some(function (mt) { return kindOf(mt.a[0]) === kind; });
        });
    }

    // The core groups are the ones that carry the lecture (or anything that is
    // neither a tut nor a prac). Some modules bundle a tut into the same group as
    // the lecture and list the alternative tut slots as sibling groups; those
    // siblings must not turn up in the group picker, or picking one silently
    // drops the lecture. Modules with no lecture at all fall back to every group.
    function coreOptions(groups) {
        var core = Object.keys(groups).filter(function (gid) {
            var kinds = groupKinds(groups, gid);
            return kinds.L || kinds.X;
        });
        return core.length ? core : Object.keys(groups);
    }

    function resolvePick(pick) {
        var off = getOffering(pick);
        if (!off) return null;
        var groups = off.groups;
        var core = coreOptions(groups);
        var tutOptions = groupsWithKind(groups, "T");
        var pracOptions = groupsWithKind(groups, "P");

        // A tut/prac is only a separate decision when its groups differ from the
        // core groups. When the two sets match, the group picker already decides
        // it and a second picker would just be the same buttons twice over.
        var splitT = tutOptions.length > 0 && !sameSet(tutOptions, core);
        var splitP = pracOptions.length > 0 && !sameSet(pracOptions, core);

        var coreGid = core.indexOf(pick.core) !== -1 ? pick.core : core[0];

        // Resolve the extra picks here rather than trusting stored state, so a
        // stale choice left over from an earlier group cannot blank out a slot.
        function settle(split, options, chosen) {
            if (!split) return null;
            return options.indexOf(chosen) !== -1 ? chosen : options[0];
        }
        var chosenT = settle(splitT, tutOptions, pick.extra && pick.extra.T);
        var chosenP = settle(splitP, pracOptions, pick.extra && pick.extra.P);
        var out = [];

        function pushFrom(gid, mode) {
            (groups[gid] || []).forEach(function (mt) {
                var k = kindOf(mt.a[0]);
                var take;
                if (mode === "core") {
                    take = k === "L" || k === "X" ||
                        (k === "T" && (!chosenT || chosenT === gid)) ||
                        (k === "P" && (!chosenP || chosenP === gid));
                } else {
                    take = k === mode;
                }
                if (!take) return;
                var key = mt.d + "|" + mt.s + "|" + mt.e + "|" + k;
                var existing = out.find(function (x) { return x.key === key; });
                if (existing) {
                    if (!existing.raw.includes(mt.a)) existing.raw += "/" + mt.a;
                    return;
                }
                var vi = pick.venues ? pick.venues[key] : undefined;
                out.push({
                    key: key,
                    d: mt.d, s: mt.s, e: mt.e,
                    kind: k, raw: mt.a,
                    venues: mt.v,
                    venueIdx: Math.min(vi || 0, mt.v.length - 1)
                });
            });
        }

        pushFrom(coreGid, "core");

        ["T", "P"].forEach(function (kind) {
            var chosen = kind === "T" ? chosenT : chosenP;
            if (chosen && groups[chosen] && chosen !== coreGid) pushFrom(chosen, kind);
        });

        out.sort(function (a, b) { return a.d - b.d || toMinutes(a.s) - toMinutes(b.s); });

        return {
            offering: off,
            coreOptionsList: core,
            coreGid: coreGid,
            tutOptions: tutOptions,
            pracOptions: pracOptions,
            splitT: splitT,
            splitP: splitP,
            chosenT: chosenT,
            chosenP: chosenP,
            meetings: out
        };
    }

    function visibleBlocks() {
        var blocks = [];
        state.picks.forEach(function (pick, pi) {
            if (!offeringMatches(pick.offered, state.semester)) return;
            var res = resolvePick(pick);
            if (!res) return;
            res.meetings.forEach(function (mt) {
                blocks.push({
                    source: "p" + pi,
                    code: pick.code,
                    colorIdx: pi % PALETTE.length,
                    d: mt.d, s: mt.s, e: mt.e,
                    raw: mt.raw,
                    venue: mt.venues[Math.min(mt.venueIdx, mt.venues.length - 1)] || ""
                });
            });
        });
        state.custom.forEach(function (c, ci) {
            blocks.push({
                source: "c" + ci,
                code: c.name || "Custom",
                colorIdx: (state.picks.length + ci) % PALETTE.length,
                d: c.day, s: c.start, e: c.end,
                raw: "",
                venue: c.venue || ""
            });
        });
        return blocks;
    }

    function findClashes(blocks) {
        var clashes = [];
        for (var i = 0; i < blocks.length; i++) {
            for (var j = i + 1; j < blocks.length; j++) {
                var a = blocks[i], b = blocks[j];
                if (a.source === b.source || a.d !== b.d) continue;
                if (toMinutes(a.s) < toMinutes(b.e) && toMinutes(b.s) < toMinutes(a.e)) {
                    clashes.push({ a: a, b: b });
                }
            }
        }
        return clashes;
    }

    /* ---------- rendering ---------- */

    function renderChips() {
        els.chips.innerHTML = "";
        SEMESTERS.forEach(function (sem) {
            var btn = document.createElement("button");
            btn.type = "button";
            btn.className = "chip";
            btn.textContent = sem.label;
            btn.dataset.sem = sem.id;
            btn.setAttribute("role", "radio");
            btn.addEventListener("click", function () {
                state.semester = sem.id;
                save();
                renderAll();
            });
            els.chips.appendChild(btn);
        });
    }

    // The chips are built once, so the selected one has to be re-marked on every
    // render or the highlight stays stuck wherever the page happened to load.
    function syncChips() {
        els.chips.querySelectorAll(".chip").forEach(function (btn) {
            btn.setAttribute("aria-checked", String(btn.dataset.sem === state.semester));
        });
    }

    function segButton(label, selected, onClick) {
        var b = document.createElement("button");
        b.type = "button";
        b.textContent = label;
        b.setAttribute("data-selected", String(selected));
        b.setAttribute("aria-pressed", String(selected));
        b.addEventListener("click", onClick);
        return b;
    }

    function renderPicks() {
        els.picks.innerHTML = "";
        els.emptyMsg.hidden = state.picks.length > 0 || state.custom.length > 0;

        state.picks.forEach(function (pick, pi) {
            var res = resolvePick(pick);
            if (!res) return;
            var filtered = !offeringMatches(pick.offered, state.semester);
            var card = document.createElement("div");
            card.className = filtered ? "pick pick--filtered" : "pick";
            card.style.setProperty("--pick-color", PALETTE[pi % PALETTE.length]);

            var head = document.createElement("div");
            head.className = "pick__head";
            var title = document.createElement("span");
            title.className = "pick__code";
            title.textContent = pick.code;
            var badge = document.createElement("span");
            badge.className = "pick__offered";
            var off = res.offering.offered;
            badge.textContent = off === "Y" ? "Year" : "S" === off[0] ? "Sem " + off[1] : off;
            head.appendChild(title);
            head.appendChild(badge);

            var remove = document.createElement("button");
            remove.type = "button";
            remove.className = "pick__remove";
            remove.textContent = "\u00D7";
            remove.setAttribute("aria-label", "Remove " + pick.code);
            remove.addEventListener("click", function () {
                state.picks.splice(pi, 1);
                save();
                renderAll();
            });
            head.appendChild(remove);
            card.appendChild(head);

            if (filtered) {
                var note = document.createElement("p");
                note.className = "pick__note";
                note.textContent = "Hidden by the " + semesterLabel(state.semester) + " filter.";
                card.appendChild(note);
            }

            // offering switcher
            var mod = findModule(pick.code);
            if (mod && mod.offerings.length > 1) {
                var offWrap = document.createElement("div");
                offWrap.className = "stream";
                var offLabel = document.createElement("p");
                offLabel.className = "stream__label";
                offLabel.textContent = "Offered in";
                offWrap.appendChild(offLabel);
                var seg = document.createElement("div");
                seg.className = "seg";
                mod.offerings.forEach(function (o) {
                    seg.appendChild(segButton(o.offered, o.offered === pick.offered, function () {
                        pick.offered = o.offered;
                        pick.core = null;
                        pick.extra = {};
                        autoAssign(pick);
                        save();
                        renderAll();
                    }));
                });
                offWrap.appendChild(seg);
                card.appendChild(offWrap);
            }

            // core group switcher
            if (res.coreOptionsList.length > 1) {
                card.appendChild(streamRow("Group", res.coreOptionsList, pick.core, function (gid) {
                    pick.core = gid;
                    save();
                    renderAll();
                }));
            }

            // tutorial / practical pickers, only where they are a real choice
            [
                ["Tutorial", "T", res.tutOptions, res.splitT, res.chosenT],
                ["Practical", "P", res.pracOptions, res.splitP, res.chosenP]
            ].forEach(function (spec) {
                var label = spec[0], kind = spec[1], options = spec[2];
                if (!spec[3] || options.length < 2) return;
                card.appendChild(streamRow(label, options, spec[4], function (gid) {
                    pick.extra = pick.extra || {};
                    pick.extra[kind] = gid;
                    save();
                    renderAll();
                }));
            });

            // venue pickers
            var venueSlots = res.meetings.filter(function (mt) { return mt.venues.length > 1; });
            if (venueSlots.length) {
                var wrap = document.createElement("div");
                wrap.className = "venues";
                venueSlots.forEach(function (mt) {
                    var row = document.createElement("div");
                    row.className = "venue-row";
                    var lab = document.createElement("span");
                    lab.textContent = DAY_NAMES[mt.d].slice(0, 3) + " " + mt.s;
                    var sel = document.createElement("select");
                    sel.setAttribute("aria-label", "Venue for " + pick.code + " on " + DAY_NAMES[mt.d]);
                    mt.venues.forEach(function (v, vi) {
                        var opt = document.createElement("option");
                        opt.value = String(vi);
                        opt.textContent = v;
                        opt.selected = vi === Math.min(mt.venueIdx, mt.venues.length - 1);
                        sel.appendChild(opt);
                    });
                    sel.addEventListener("change", function () {
                        pick.venues = pick.venues || {};
                        pick.venues[mt.key] = parseInt(sel.value, 10);
                        save();
                        renderAll();
                    });
                    row.appendChild(lab);
                    row.appendChild(sel);
                    wrap.appendChild(row);
                });
                card.appendChild(wrap);
            }

            els.picks.appendChild(card);
        });

        state.custom.forEach(function (c, ci) {
            var card = document.createElement("div");
            card.className = "pick";
            card.style.setProperty("--pick-color", PALETTE[(state.picks.length + ci) % PALETTE.length]);
            var head = document.createElement("div");
            head.className = "pick__head";
            var title = document.createElement("span");
            title.className = "pick__code";
            title.textContent = c.name || "Custom class";
            var meta = document.createElement("span");
            meta.className = "pick__offered";
            meta.textContent = DAY_NAMES[c.day].slice(0, 3) + " " + c.start;
            var remove = document.createElement("button");
            remove.type = "button";
            remove.className = "pick__remove";
            remove.textContent = "\u00D7";
            remove.setAttribute("aria-label", "Remove " + (c.name || "custom class"));
            remove.addEventListener("click", function () {
                state.custom.splice(ci, 1);
                save();
                renderAll();
            });
            head.appendChild(title);
            head.appendChild(meta);
            head.appendChild(remove);
            card.appendChild(head);
            els.picks.appendChild(card);
        });
    }

    function streamRow(label, options, selected, onPick) {
        var wrap = document.createElement("div");
        wrap.className = "stream";
        var lab = document.createElement("p");
        lab.className = "stream__label";
        lab.textContent = label;
        var seg = document.createElement("div");
        seg.className = "seg";
        options.forEach(function (gid) {
            seg.appendChild(segButton(gid, gid === selected, function () { onPick(gid); }));
        });
        wrap.appendChild(lab);
        wrap.appendChild(seg);
        return wrap;
    }

    // Two blocks at the same time used to be drawn on top of each other, which
    // hid whichever one lost. Overlapping blocks now share the column width.
    function packDay(dayBlocks) {
        var sorted = dayBlocks.slice().sort(function (a, b) {
            return toMinutes(a.s) - toMinutes(b.s) || toMinutes(a.e) - toMinutes(b.e);
        });

        var out = [], cluster = [], clusterEnd = -1;

        function flush() {
            if (!cluster.length) return;
            var laneEnds = [];
            var assigned = cluster.map(function (b) {
                var lane = 0;
                while (lane < laneEnds.length && laneEnds[lane] > toMinutes(b.s)) lane++;
                laneEnds[lane] = toMinutes(b.e);
                return { block: b, lane: lane };
            });
            assigned.forEach(function (a) {
                out.push({ block: a.block, lane: a.lane, lanes: laneEnds.length });
            });
            cluster = [];
            clusterEnd = -1;
        }

        sorted.forEach(function (b) {
            if (cluster.length && toMinutes(b.s) >= clusterEnd) flush();
            cluster.push(b);
            clusterEnd = Math.max(clusterEnd, toMinutes(b.e));
        });
        flush();
        return out;
    }

    function renderGrid(blocks, clashes) {
        els.grid.innerHTML = "";
        els.boardEmpty.hidden = blocks.length > 0;
        els.boardEmpty.textContent = (state.picks.length || state.custom.length)
            ? "Everything you have added sits outside " + semesterLabel(state.semester) + ". Switch the filter to All to see it."
            : "Nothing on the board yet.";

        var clashKeys = new Set();
        clashes.forEach(function (c) { clashKeys.add(c.a); clashKeys.add(c.b); });

        var minM = DAY_START, maxM = DAY_END;
        blocks.forEach(function (b) {
            minM = Math.min(minM, toMinutes(b.s));
            maxM = Math.max(maxM, toMinutes(b.e));
        });
        minM = floorHalf(minM);
        maxM = ceilHalf(maxM);
        var span = maxM - minM;
        // On paper the whole week has to land on one page, so the scale shrinks
        // to fit rather than spilling a stray Friday afternoon onto page two.
        var pxPerMin = printMode ? Math.min(PX_PER_MIN, PRINT_HEIGHT_PX / span) : PX_PER_MIN;

        var corner = document.createElement("div");
        els.grid.appendChild(corner);

        for (var d = 1; d <= 5; d++) {
            var dayHead = document.createElement("div");
            dayHead.className = "grid__day";
            dayHead.textContent = DAY_NAMES[d];
            els.grid.appendChild(dayHead);
        }

        var axis = document.createElement("div");
        axis.className = "grid__axis";
        axis.style.height = span * pxPerMin + "px";
        for (var t = minM; t <= maxM; t += 60) {
            var lab = document.createElement("span");
            lab.style.top = (t - minM) * pxPerMin + "px";
            lab.textContent = fmtTime(t);
            axis.appendChild(lab);
        }
        els.grid.appendChild(axis);

        for (var day = 1; day <= 5; day++) {
            var col = document.createElement("div");
            col.className = "grid__col";
            col.style.height = span * pxPerMin + "px";
            col.style.setProperty("--hour-px", 60 * pxPerMin + "px");

            packDay(blocks.filter(function (b) { return b.d === day; })).forEach(function (slot) {
                var b = slot.block;
                var top = (toMinutes(b.s) - minM) * pxPerMin;
                var height = Math.max((toMinutes(b.e) - toMinutes(b.s)) * pxPerMin - 2, 16);
                var el = document.createElement("div");
                el.className = "block" +
                    (clashKeys.has(b) ? " block--clash" : "") +
                    (slot.lanes >= 3 ? " block--tight" : "");
                el.style.top = top + "px";
                el.style.height = height + "px";
                el.style.left = "calc(" + (100 * slot.lane / slot.lanes) + "% + 2px)";
                el.style.width = "calc(" + (100 / slot.lanes) + "% - 4px)";
                el.style.right = "auto";
                el.style.setProperty("--block-color", PALETTE[b.colorIdx]);

                var code = document.createElement("div");
                code.className = "block__code";
                code.textContent = b.code + (b.raw ? " " + b.raw : "");
                var venue = document.createElement("div");
                venue.className = "block__venue";
                venue.textContent = [b.s, b.venue].filter(Boolean).join(" \u00B7 ");
                el.appendChild(code);
                el.appendChild(venue);
                col.appendChild(el);
            });

            els.grid.appendChild(col);
        }
    }

    function renderClashes(clashes) {
        if (!clashes.length) {
            els.clashBanner.hidden = true;
            return;
        }
        els.clashBanner.innerHTML = "";
        var strong = document.createElement("strong");
        strong.textContent = clashes.length + " clash" + (clashes.length > 1 ? "es" : "") + " found:";
        els.clashBanner.appendChild(strong);
        var ul = document.createElement("ul");
        clashes.slice(0, 8).forEach(function (c) {
            var li = document.createElement("li");
            li.innerHTML = "";
            li.textContent = c.a.code + " \u00D7 " + c.b.code + " \u00B7 " +
                DAY_NAMES[c.a.d].slice(0, 3) + " " + c.a.s;
            ul.appendChild(li);
        });
        els.clashBanner.appendChild(ul);
        els.clashBanner.hidden = false;
    }

    function renderAll() {
        var blocks = visibleBlocks();
        var clashes = findClashes(blocks);
        renderClashes(clashes);
        renderGrid(blocks, clashes);
        renderPicks();
        renderStamp(blocks);
        syncChips();
    }

    // Only ever visible on paper. A printed grid with no label on it is useless
    // the moment it is sitting next to three other printed grids.
    function renderStamp(blocks) {
        var codes = [];
        blocks.forEach(function (b) {
            if (codes.indexOf(b.code) === -1) codes.push(b.code);
        });
        els.stamp.textContent = codes.length
            ? semesterLabel(state.semester) + " \u00B7 " + codes.join(", ")
            : semesterLabel(state.semester);
    }

    /* ---------- search ---------- */

    var activeIndex = -1;

    function clearResults() {
        els.results.innerHTML = "";
        els.results.hidden = true;
        els.search.setAttribute("aria-expanded", "false");
        activeIndex = -1;
    }

    var MAX_RESULTS = 25;

    // Codes get compared with the spaces and punctuation stripped, so "inf214",
    // "INF 214" and "inf-214" all land on the same module.
    function searchKey(s) { return s.toUpperCase().replace(/[^A-Z0-9]/g, ""); }

    function searchModules(q) {
        var needle = searchKey(q);
        if (!needle) return { hits: [], total: 0 };

        var exact = [], prefix = [], contains = [];
        DATA.modules.forEach(function (m) {
            var c = searchKey(m.code);
            if (c === needle) exact.push(m);
            else if (c.indexOf(needle) === 0) prefix.push(m);
            else if (c.indexOf(needle) !== -1) contains.push(m);
        });

        var all = exact.concat(prefix, contains);
        return { hits: all.slice(0, MAX_RESULTS), total: all.length };
    }

    function noticeRow(text) {
        var li = document.createElement("li");
        li.className = "search__notice";
        li.textContent = text;
        return li;
    }

    function renderResults(result, query) {
        var list = result.hits;
        els.results.innerHTML = "";
        activeIndex = -1;

        // An empty box is silent about whether the code was wrong or the search
        // simply did nothing, so say which.
        if (!list.length) {
            if (!searchKey(query || "")) {
                els.results.hidden = true;
                els.search.setAttribute("aria-expanded", "false");
                return;
            }
            els.results.appendChild(noticeRow("No module code matches that."));
            els.results.hidden = false;
            els.search.setAttribute("aria-expanded", "true");
            return;
        }

        list.forEach(function (m, i) {
            var already = state.picks.some(function (p) { return p.code === m.code; });
            var li = document.createElement("li");
            li.setAttribute("role", "option");
            li.setAttribute("id", "search-opt-" + i);
            li.setAttribute("data-active", "false");
            if (already) li.setAttribute("data-added", "true");

            var code = document.createElement("span");
            code.className = "search__code";
            code.textContent = m.code;

            var meta = document.createElement("span");
            meta.className = "search__meta";
            meta.textContent = already
                ? "Already added"
                : m.offerings.map(function (o) { return o.offered; }).join(" \u00B7 ");

            li.appendChild(code);
            li.appendChild(meta);
            li.addEventListener("mousedown", function (ev) {
                ev.preventDefault();
                addModule(m.code);
            });
            els.results.appendChild(li);
        });

        if (result.total > list.length) {
            els.results.appendChild(
                noticeRow((result.total - list.length) + " more. Type another character to narrow it down.")
            );
        }

        els.results.hidden = false;
        els.search.setAttribute("aria-expanded", "true");
    }

    function addModule(code) {
        var mod = findModule(code);
        if (!mod) return;
        if (state.picks.some(function (p) { return p.code === code; })) {
            toast(code + " is already on the board");
            return;
        }
        var offered = mod.offerings[0].offered;
        var match = mod.offerings.find(function (o) { return o.offered === state.semester; })
            || mod.offerings.find(function (o) { return offeringMatches(o.offered, state.semester); });
        if (match) offered = match.offered;

        var pick = { code: code, offered: offered, core: null, extra: {}, venues: {} };
        autoAssign(pick);
        state.picks.push(pick);
        save();
        els.search.value = "";
        clearResults();
        renderAll();
    }

    function autoAssign(pick) {
        var res = resolvePick(pick);
        if (!res) return;
        pick.core = res.coreGid;
        pick.extra = pick.extra || {};
        res = resolvePick(pick);
        if (res.chosenT) pick.extra.T = res.chosenT;
        if (res.chosenP) pick.extra.P = res.chosenP;
    }

    /* ---------- events ---------- */

    function bindEvents() {
        els.search.addEventListener("input", function () {
            renderResults(searchModules(els.search.value), els.search.value);
        });
        els.search.addEventListener("keydown", function (ev) {
            var items = els.results.querySelectorAll("li[role=\"option\"]");
            if (els.results.hidden) return;
            if (ev.key === "ArrowDown" || ev.key === "ArrowUp") {
                ev.preventDefault();
                activeIndex += ev.key === "ArrowDown" ? 1 : -1;
                if (activeIndex < 0) activeIndex = items.length - 1;
                if (activeIndex >= items.length) activeIndex = 0;
                items.forEach(function (li, i) {
                    li.setAttribute("data-active", String(i === activeIndex));
                });
                els.search.setAttribute("aria-activedescendant", items[activeIndex].id);
            } else if (ev.key === "Enter") {
                ev.preventDefault();
                if (items[activeIndex]) items[activeIndex].dispatchEvent(new Event("mousedown"));
                else if (items.length) items[0].dispatchEvent(new Event("mousedown"));
            } else if (ev.key === "Escape") {
                clearResults();
            }
        });
        document.addEventListener("click", function (ev) {
            if (!document.getElementById("search-box").contains(ev.target)) clearResults();
        });

        els.customForm.addEventListener("submit", function (ev) {
            ev.preventDefault();
            var name = document.getElementById("custom-name").value.trim();
            var day = parseInt(document.getElementById("custom-day").value, 10);
            var start = document.getElementById("custom-start").value;
            var end = document.getElementById("custom-end").value;
            var venue = document.getElementById("custom-venue") ? document.getElementById("custom-venue").value.trim() : "";
            if (!name || !start || !end || toMinutes(end) <= toMinutes(start)) return;
            state.custom.push({ name: name, day: day, start: start, end: end, venue: venue });
            save();
            els.customForm.reset();
            document.getElementById("custom-start").value = "18:00";
            document.getElementById("custom-end").value = "19:00";
            renderAll();
        });

        els.printBtn.addEventListener("click", function () { window.print(); });

        // Chrome and Firefox both fire these around the print dialog, which is
        // the only chance to redraw the grid at the paper scale.
        window.addEventListener("beforeprint", function () {
            printMode = true;
            renderAll();
        });
        window.addEventListener("afterprint", function () {
            printMode = false;
            renderAll();
        });

        els.shareBtn.addEventListener("click", function () {
            // Whatever host this is served from, minus any query the visitor
            // happened to arrive with.
            var url = location.href.split(/[?#]/)[0] + buildHash();
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function () {
                    toast("Link copied");
                }, function () {
                    toast("Your browser blocked the copy");
                });
            } else {
                toast(url);
            }
        });

        els.resetBtn.addEventListener("click", function () {
            if (!confirm("Clear everything off the board?")) return;
            state = { semester: state.semester, picks: [], custom: [] };
            save();
            renderAll();
        });
    }

    /* ---------- boot ---------- */

    if (window.TUKS_DATA && Array.isArray(window.TUKS_DATA.modules)) {
        DATA = window.TUKS_DATA;
        load();
        renderChips();
        bindEvents();
        renderAll();
    } else {
        els.emptyMsg.textContent = "data.js did not load, so there are no modules to search.";
        els.emptyMsg.hidden = false;
    }
})();
