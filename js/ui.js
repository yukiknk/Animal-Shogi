import { board, turn, movePiece, PIECES } from "./core.js";

const boardEl = document.getElementById("board");
const turnInfo = document.getElementById("turn-info");

let selected = null; // {r,c}

// 最初の描画
render();

// --- 盤クリック ---
boardEl.addEventListener("click", e=>{
  const cell = e.target.closest(".square");
  if(!cell) return;

  const r = Number(cell.dataset.row);
  const c = Number(cell.dataset.col);
  const piece = board[r][c];

  if(selected && !(selected.r===r && selected.c===c)){
    // 駒を持っていれば移動トライ
    const winner = movePiece(selected.r, selected.c, r, c);
    selected = null;
    render();
    if(winner!=null) alert(`🎉 ${winner===0?"先手":"後手"}の勝ち！`);
  }else if(piece && piece.owner===turn){
    // 自分の駒を選択
    selected = {r,c};
    render();
  }
});

// --- 描画関数 ---
function render(){
  boardEl.innerHTML = ""; // 全消し
  for(let r=0;r<4;r++){
    for(let c=0;c<3;c++){
      const sq = document.createElement("div");
      sq.className = "square";
      sq.dataset.row = r; sq.dataset.col = c;

      const piece = board[r][c];
      if(piece){
        const img = document.createElement("img");
        img.className = "piece";
        img.src = `img/pieces/${piece.type}.svg`;
        if(selected && selected.r===r && selected.c===c) img.classList.add("selected");
        // 後手(上側)は 180° 回転
        if(piece.owner===1) img.style.transform = "rotate(180deg)";
        sq.appendChild(img);
      }
      boardEl.appendChild(sq);
    }
  }
  turnInfo.textContent = turn===0 ? "先手の番です。" : "後手の番です。";
}

