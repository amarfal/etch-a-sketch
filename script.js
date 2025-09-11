document.addEventListener('DOMContentLoaded', () => {
    // helpers
    const $ = (sel) => document.querySelector(sel);

    const board     = $("#board");
    const resizeBtn = $("#resizeBtn");
    const clearBtn  = $("#clearBtn");

    

    const MAX = 100;
    const DEFAULT_N = 16;

    makeGrid(DEFAULT_N);
    wireUI();

    /* controls */
    function wireUI() {
        resizeBtn.addEventListener("click", () => {
            let n = prompt("How many squares per side? (1-100)", "16");
            if (n === null) return;
            n = parseInt(n, 10);

            if (Number.isNaN(n) || n < 1 || n > MAX) {
            alert("Please enter a whole number from 1 to 100.");
            return;
            }
            makeGrid(n);
        });

        clearBtn.addEventListener("click", clearGrid);
    }

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
