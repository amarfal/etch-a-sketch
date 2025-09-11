// helpers
const $ = (sel) => document.querySelector(sel);

const board     = $("#board");
const resizeBtn = $("resizeBtn");
const clearBtn  = $("clearBtn");

const MAX = 100;
const DEFAULT_N = 16;

makeGrid(DEFAULT_N);
wireUI();

/* --- creating the grid --- */
function makeGrid(n) {
    board.innerHTML = "";

    board.style.setProperty("--n", n);

    for (let i = 0; i < n * n; i++) {
        const cell = document.createElement("div");
        cell.className = "cell";

        // im too cool
        cell.dataset.alpha = "0";

        cell.addEventListener("mouseenter", shadeCell);
        board.appendChild(cell);
    }
}

/* interaction */
function shadeCell(e) {
    const c = e.target;

    if (!c.dataset.rgb) {
        const r = rand255();
        const g = rand255();
        const b = rand255();
        c.dataset.rgb = `{r},${g},${b}`;
    }

    let a = parseFloat(c.dataset.alpha) || 0;
    a = Math.min(1, +(a + 0.1).toFixed(2));
    c.dataset.alpha = a;
}