document.addEventListener('DOMContentLoaded', () => {
    // helpers
    const $ = (sel) => document.querySelector(sel);

    const board      = $("#board");
    const clearBtn   = $("#clearBtn");

    const chkEraser  = $("#eraser");
    const chkGrid    = $("#gridLines");
    const chkRainbow = $("#rainbow");
    const chkClick   = $("#clickDraw");
    const sizeRange  = $("#size");
    const sizeVal    = $("#sizeVal");

    const palette    = $("#palette");
    const pickDot    = $("#pickDot");

    let penColor = "#1d4ed8";

    const MAX = 100;
    let n = 16;

    let drawing = false;

    makeGrid(n);
    wireUI();

    /* --- controls --- */
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


        sizeRange.addEventListener("input", () => {
            sizeVal.textContent = sizeRange.value;
        });
        sizeRange.addEventListener("change", () => {
            n = clamp(parseInt(sizeRange.value, 10), 4, MAX);
            makeGrid(n);
        });
        sizeVal.textContent = sizeRange.value;
  
        // clear board
        clearBtn.addEventListener("click", clearGrid);
  
        // draw handling 
        board.addEventListener("mousedown", (e) => {
            drawing = true;
            if (isCell(e.target)) shadeCell(e.target);
        });
        board.addEventListener("mouseover", (e) => {
            if (isCell(e.target) && (!chkClick.checked || drawing)) {
                shadeCell(e.target);
            }
        });
        window.addEventListener("mouseup", () => drawing = false);
        board.addEventListener("mouseleave", () => drawing = false);
    }

    /* --- creating the grid --- */
    function makeGrid(n) {
        board.innerHTML = "";
        board.style.setProperty("--n", n);

        for (let i = 0; i < n * n; i++) {
            const cell = document.createElement("div");
            cell.className = "cell";
            board.appendChild(cell);
        }
    }

    /* --- interaction --- */
    function shadeCell(cell) {
        if (!isCell(cell)) return;

        let color;

        if (chkEraser.checked) {
            color = "#ffffff";
        } else if (chkRainbow.checked) {
            color = randomColor();
        } else {
            color = penColor;
        }
        cell.style.backgroundColor = color;
    }

    function clearGrid() {
        board.querySelectorAll(".cell").forEach(c => (c.style.backgroundColor = "#ffffff"));
    }

    // helpers 
    function randomColor() {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r} ${g} ${b})`;
    }
    function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
    function isCell(el) { return el && el.classList && el.classList.contains("cell"); }

    drawPalette();                                 
    palette.addEventListener("mousedown", handlePick);
    palette.addEventListener("mousemove", (e) => {
        if (e.buttons) handlePick(e);                
    });

    function drawPalette() {
        const ctx = palette.getContext("2d");
        const w = palette.width;
        const h = palette.height;
  
    // horizontal HUE gradient
    const hue = ctx.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= 360; i += 10) {
        hue.addColorStop(i / 360, `hsl(${i} 100% 50%)`);
    }
    ctx.fillStyle = hue;
    ctx.fillRect(0, 0, w, h);
  
    // top WHITE overlay
    const white = ctx.createLinearGradient(0, 0, 0, h);
    white.addColorStop(0.00, "rgba(255,255,255,1)");
    white.addColorStop(0.50, "rgba(255,255,255,0)");
    ctx.fillStyle = white;
    ctx.fillRect(0, 0, w, h);
  
    // bottom BLACK overlay
    const black = ctx.createLinearGradient(0, 0, 0, h);
    black.addColorStop(0.50, "rgba(0,0,0,0)");
    black.addColorStop(1.00, "rgba(0,0,0,1)");
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, w, h);
  
    // initial dot (upper-left-ish)
    pickDot.style.left = "8%";
    pickDot.style.top  = "8%";
    }
  
    function handlePick(e) {
        const rect = palette.getBoundingClientRect();
        // scale client coords to canvas coords
        const x = Math.floor((e.clientX - rect.left) * (palette.width / rect.width));
        const y = Math.floor((e.clientY - rect.top)  * (palette.height / rect.height));
        const ctx = palette.getContext("2d");
        const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
  
        penColor = rgbToHex(r, g, b);
  
        // move the selection dot
        pickDot.style.left = `${(x / palette.width) * 100}%`;
        pickDot.style.top  = `${(y / palette.height) * 100}%`;
    }
  
    function rgbToHex(r, g, b) {
        return "#" + [r, g, b].map(v => v.toString(16).padStart(2, "0")).join("");
    }
});

