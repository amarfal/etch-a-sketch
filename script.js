document.addEventListener('DOMContentLoaded', () => {
    // helpers
    const $ = (sel) => document.querySelector(sel);

    const board      = $("#board");
    const clearBtn   = $("#clearBtn");
    const colorPick  = $("#color");
    const chkEraser  = $("#eraser");
    const chkGrid    = $("#gridLines");
    const chkRainbow = $("#rainbow");
    const chkClick   = $("#clickDraw");
    const sizeRange  = $("#size");
    const sizeVal    = $("#sizeVal");

    const MAX = 100;
    const DEFAULT_N = 16;
    let n = DEFAULT_N;

    let drawing = false;
    let colorMode = "color";

    makeGrid(n);
    wireUI();

    /* controls */
    function wireUI() {
        // grid lines toggle
        chkGrid.addEventListener("change", () => {
          board.classList.toggle("with-grid", chkGrid.checked);
        });
        board.classList.toggle("with-grid", chkGrid.checked);
    
        // color mode toggle
        chkEraser.addEventListener("change", () => {
          if (chkEraser.checked) { chkRainbow.checked = false; colorMode = "eraser"; }
          else                   { colorMode = chkRainbow.checked ? "rainbow" : "color"; }
        });
        chkRainbow.addEventListener("change", () => {
          if (chkRainbow.checked) { chkEraser.checked = false; colorMode = "rainbow"; }
          else                    { colorMode = chkEraser.checked ? "eraser" : "color"; }
    });

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
            c.dataset.rgb = `${r},${g},${b}`;
        }   

        let a = parseFloat(c.dataset.alpha) || 0;
        a = Math.min(1, +(a + 0.333).toFixed(2));
        c.dataset.alpha = a;

        c.style.backgroundColor = `rgba(${c.dataset.rgb}, ${a})`;
    }

    function rand255() {
        return Math.floor(Math.random() * 256);
    }

    function clearGrid() {
        board.querySelectorAll(".cell").forEach(cell => {
            cell.style.backgroundColor = "#ffffff";
            cell.dataset.rgb = "";
            cell.dataset.alpha = "0";
        });
    }
});
