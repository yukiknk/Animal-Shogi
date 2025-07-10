// ----- 駒と移動ベクトル (row, col) -----
export const PIECES = {
  lion:      { owner: 0, moves: [[-1,0],[0,1],[1,0],[0,-1],[-1,-1],[-1,1],[1,1],[1,-1]] },
  giraffe:   { owner: 0, moves: [[-1,0],[0,1],[1,0],[0,-1]] },
  elephant:  { owner: 0, moves: [[-1,-1],[-1,1],[1,1],[1,-1]] },
  chick:     { owner: 0, moves: [[-1,0]], promote: "hen" },
  hen:       { owner: 0, moves: [[-1,0],[0,1],[1,0],[0,-1],[-1,1],[1,1]] },
};

// ----- 初期盤 4×3 (row0 が後手側) -----
export let board = [
  [ {type:"giraffe",owner:1}, {type:"lion",owner:1}, {type:"elephant",owner:1} ],
  [ null,                    {type:"chick", owner:1}, null                     ],
  [ null,                    {type:"chick", owner:0}, null                     ],
  [ {type:"elephant",owner:0},{type:"lion", owner:0},{type:"giraffe", owner:0} ],
];

// 0 = 先手 (下) / 1 = 後手 (上)
export let turn = 0;

// ----- 位置ヘルパ -----
export function inside(r, c){ return r>=0 && r<4 && c>=0 && c<3; }

// ----- 手を適用 -----
export function movePiece(fromR, fromC, toR, toC){
  const src = board[fromR][fromC];
  if(!src || src.owner!==turn) return false;

  const dr = toR - fromR, dc = toC - fromC;
  const legal = PIECES[src.type].moves.some(([mr,mc])=>mr===dr && mc===dc);
  if(!legal) return false;

  // 移動 & 取る
  board[toR][toC] = {...src};
  board[fromR][fromC] = null;

  // 成り (ヒヨコが敵陣最奥に入ったら自動)
  if(src.type==="chick" && toR=== (turn===0 ? 0 : 3)){
    board[toR][toC].type = "hen";
  }

  // 勝敗判定：ライオンを取った？
  const flat = board.flat();
  const lions = flat.filter(p=>p?.type==="lion" && p.owner=== (1-turn));
  const winner = lions.length===0 ? turn : null;

  turn = 1 - turn;
  return winner; // null なら続行、0/1 なら勝者
}
