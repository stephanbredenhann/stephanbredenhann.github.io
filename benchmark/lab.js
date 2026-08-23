(function () {
    "use strict";

    var GAME_ORDER = ["snake", "breakout", "freeform"];

    document.querySelectorAll(".prompt").forEach(function (el) {
        var key = el.getAttribute("data-prompt");
        el.textContent = (window.GAME_PROMPTS || {})[key] || "(prompt not loaded)";
    });

    var entries = window.LAB_ENTRIES || [];
    var titles = window.GAME_TITLES || {};
    var runs = document.getElementById("runs");
    var empty = document.getElementById("runs-empty");
    var modal = document.getElementById("games-modal");
    var modalTitle = document.getElementById("modal-title");
    var modalSub = document.getElementById("modal-sub");
    var modalList = document.getElementById("modal-list");

    empty.hidden = entries.length > 0;

    function played(entry) {
        return GAME_ORDER.filter(function (g) { return entry.games && entry.games[g]; });
    }

    function fact(label, value) {
        var wrap = document.createElement("div");
        wrap.className = "run__fact";
        var dt = document.createElement("dt");
        dt.textContent = label;
        var dd = document.createElement("dd");
        dd.textContent = value;
        wrap.appendChild(dt);
        wrap.appendChild(dd);
        return wrap;
    }

    function openModal(entry) {
        modalTitle.textContent = entry.model;
        var done = played(entry).length;
        modalSub.textContent = done
            ? done + " of " + GAME_ORDER.length + " written up so far."
            : "None of the three have been written up yet.";

        modalList.innerHTML = "";
        GAME_ORDER.forEach(function (game) {
            var href = entry.games && entry.games[game];
            var li = document.createElement("li");
            var name = titles[game] || game;

            if (href) {
                var a = document.createElement("a");
                a.className = "modal__game";
                a.href = href;
                a.textContent = name;
                var arrow = document.createElement("span");
                arrow.className = "modal__go";
                arrow.textContent = "Read it";
                a.appendChild(arrow);
                li.appendChild(a);
            } else {
                var span = document.createElement("span");
                span.className = "modal__game modal__game--pending";
                span.textContent = name;
                var pending = document.createElement("span");
                pending.className = "modal__go";
                pending.textContent = "Not run yet";
                span.appendChild(pending);
                li.appendChild(span);
            }
            modalList.appendChild(li);
        });

        modal.showModal();
    }

    entries.forEach(function (entry) {
        var card = document.createElement("article");
        card.className = "run";

        var head = document.createElement("h3");
        head.className = "run__model";
        head.textContent = entry.model;
        card.appendChild(head);

        var facts = document.createElement("dl");
        facts.className = "run__facts";
        if (entry.effort) facts.appendChild(fact("Effort", entry.effort));
        if (entry.harness) facts.appendChild(fact("Harness", entry.harness));
        if (entry.date) facts.appendChild(fact("Tested", entry.date));
        card.appendChild(facts);

        var count = played(entry).length;
        var tally = document.createElement("p");
        tally.className = "run__tally";
        tally.textContent = count + " of " + GAME_ORDER.length + " played";
        card.appendChild(tally);

        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn btn--full";
        btn.textContent = "View games";
        btn.addEventListener("click", function () { openModal(entry); });
        card.appendChild(btn);

        runs.appendChild(card);
    });

    // Clicking the backdrop lands on the dialog itself, never on its children.
    modal.addEventListener("click", function (ev) {
        if (ev.target === modal) modal.close();
    });
})();
