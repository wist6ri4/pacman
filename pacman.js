/**
 * グローバル変数
 */
let canvas = null; // HTMLのcanvas（document.getElementById('canvas-pacman')）
let context = null; // canvasに描画するためのオブジェクト（getContext('2d')）

//迷路を表示する場所
const offsetX = 40; // x座標
const offsetY = 60; // y座標

const magnification = 18.0; // 拡大用の定数

// 画面起動時にメインメソッドを呼び出し
Main();

/**
 * メインメソッド
 */
function Main() {
    canvas = document.getElementById('canvas-pacman');
    context = canvas.getContext('2d');

    canvas.width = offsetX * 2 + magnification * 25;
    canvas.height = offsetY * 2 + magnification * 28;
    canvas.style.border = '1px solid #111';

    setInterval(Draw, 10);
};

/**
 * ゲーム本体の描画
 */
function Draw() {
    DrawMazes();
};

/**
 * 迷路の描画
 */
function DrawMazes() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    DrawWalls();
    DrawAisles();
};

/**
 * 壁の描画共通メソッド
 * @param {始点のx座標} x1 
 * @param {始点のy座標} y1 
 * @param {終点のx座標} x2 
 * @param {終点のy座標} y2 
 */
function DrawWall(x1, y1, x2, y2) {
    context.strokeStyle = 'blue'; // 線の色を青に指定
    context.lineWidth = 35; // 線の幅を指定

    // 角を潰すために線を延長
    if(y1 == y2) {
        x1 -= 0.8;
        x2 += 0.8;
    }
    if(x1 == x2) {
        y1 -= 0.8;
        y2 += 0.8;
    }

    context.beginPath(); // 新しいパスを開始
    context.moveTo(x1 * magnification + offsetX, y1 * magnification + offsetY); // 筆の始点を指定
    context.lineTo(x2 * magnification + offsetX, y2 * magnification + offsetY); // 筆の終点を指定
    context.stroke(); // 描画
};

/**
 * 道の描画共通メソッド
 * @param {始点のx座標} x1 
 * @param {始点のy座標} y1 
 * @param {終点のx座標} x2 
 * @param {終点のy座標} y2 
 */
function DrawAisle(x1, y1, x2, y2) {
    context.strokeStyle = 'black'; // 線の色を黒に指定
    context.lineWidth = 30; // 線の幅を指定

    // 角を潰すために線を延長
    if(y1 == y2) {
        x1 -= 0.8;
        x2 += 0.8;
    }
    if(x1 == y2) {
        y1 -= 0.8;
        y2 += 0.8;
    }

    context.beginPath(); // 新しいパスを開始
    context.moveTo(x1 * magnification + offsetX, y1 * magnification + offsetY); // 筆の始点を指定
    context.lineTo(x2 * magnification + offsetX, y2 * magnification + offsetY); // 筆の終点を指定
    context.stroke(); // 描画
};

/**
 * すべての壁を描画
 */
function DrawWalls() {
    // 横
    DrawWall(0, 0, 11, 0);
    DrawWall(14, 0, 25, 0);
    DrawWall(0, 4, 25, 4);
    DrawWall(0, 7, 5, 7);
    DrawWall(8, 7, 11, 7);
    DrawWall(14, 7, 17, 7);
    DrawWall(20, 7, 25, 7);
    DrawWall(8, 10, 17, 10);
    DrawWall(0, 13, 8, 13);
    DrawWall(17, 13, 25, 13);
    DrawWall(8, 16, 17, 16);
    DrawWall(0, 19, 11, 19);
    DrawWall(14, 19, 25, 19);
    DrawWall(0, 22, 2, 22);
    DrawWall(5, 22, 20, 22);
    DrawWall(23, 22, 25, 22);
    DrawWall(0, 25, 5, 25);
    DrawWall(8, 25, 11, 25);
    DrawWall(14, 25, 17, 25);
    DrawWall(20, 25, 25, 25);
    DrawWall(0, 28, 25, 28);

    // 縦
    DrawWall(0, 0, 0, 7);
    DrawWall(0, 19, 0, 22);
    DrawWall(0, 25, 0, 28);
    DrawWall(2, 22, 2, 25);
    DrawWall(5, 0, 5, 25);
    DrawWall(8, 4, 8, 7);
    DrawWall(8, 7, 11, 7);
    DrawWall(8, 10, 8, 19);
    DrawWall(8, 22, 8, 25);
    DrawWall(11, 0, 11, 4);
    DrawWall(11, 7, 11, 10);
    DrawWall(11, 19, 11, 22);
    DrawWall(11, 25, 11, 28);
    DrawWall(14, 0, 14, 4);
    DrawWall(14, 7, 14, 10);
    DrawWall(14, 19, 14, 22);
    DrawWall(14, 25, 14, 28);
    DrawWall(17, 4, 17, 7);
    DrawWall(17, 10, 17, 19);
    DrawWall(17, 22, 17, 25);
    DrawWall(20, 0, 20, 25);
    DrawWall(23, 22, 23, 25);
    DrawWall(25, 0, 25, 7);
    DrawWall(25, 19, 25, 22);
    DrawWall(25, 25, 25, 28);
};

 /**
  * すべての道を描画
  */
function DrawAisles() {
    // 横
    DrawAisle(0, 0, 11, 0);
    DrawAisle(14, 0, 25, 0);
    DrawAisle(0, 4, 25, 4);
    DrawAisle(0, 7, 5, 7);
    DrawAisle(8, 7, 11, 7);
    DrawAisle(14, 7, 17, 7);
    DrawAisle(20, 7, 25, 7);
    DrawAisle(8, 10, 17, 10);
    DrawAisle(0, 13, 8, 13);
    DrawAisle(17, 13, 25, 13);
    DrawAisle(8, 16, 17, 16);
    DrawAisle(0, 19, 11, 19);
    DrawAisle(14, 19, 25, 19);
    DrawAisle(0, 22, 2, 22);
    DrawAisle(5, 22, 20, 22);
    DrawAisle(23, 22, 25, 22);
    DrawAisle(0, 25, 5, 25);
    DrawAisle(8, 25, 11, 25);
    DrawAisle(14, 25, 17, 25);
    DrawAisle(20, 25, 25, 25);
    DrawAisle(0, 28, 25, 28);

    // 縦
    DrawAisle(0, 0, 0, 7);
    DrawAisle(0, 19, 0, 22);
    DrawAisle(0, 25, 0, 28);
    DrawAisle(2, 22, 2, 25);
    DrawAisle(5, 0, 5, 25);
    DrawAisle(8, 4, 8, 7);
    DrawAisle(8, 7, 11, 7);
    DrawAisle(8, 10, 8, 19);
    DrawAisle(8, 22, 8, 25);
    DrawAisle(11, 0, 11, 4);
    DrawAisle(11, 7, 11, 10);
    DrawAisle(11, 19, 11, 22);
    DrawAisle(11, 25, 11, 28);
    DrawAisle(14, 0, 14, 4);
    DrawAisle(14, 7, 14, 10);
    DrawAisle(14, 19, 14, 22);
    DrawAisle(14, 25, 14, 28);
    DrawAisle(17, 4, 17, 7);
    DrawAisle(17, 10, 17, 19);
    DrawAisle(17, 22, 17, 25);
    DrawAisle(20, 0, 20, 25);
    DrawAisle(23, 22, 23, 25);
    DrawAisle(25, 0, 25, 7);
    DrawAisle(25, 19, 25, 22);
    DrawAisle(25, 25, 25, 28);
};


class Direct {
    static None = 0;
    static North = 1;
    static South = 2;
    static West = 3;
    static East = 4;
};

class Position {
    CenterX = 0;
    CenterY = 0;
}

class Pacman {
    Position = null;
    Direct = Direct.West;
    NextDirect = Direct.West;
    PrevDirect = Direct.West;

    constructor() {
        this.Position = new Position();
        this.Direct = Direct.West;
        this.NextDirect = Direct.West;
    };

    GoHome() {
        this.Position.CenterX = 12.5;
        this.Position.CenterY = 22;
        this.Direct = Direct.West;
        this.NextDirect = Direct.West;
    };

    Move() {
        if(this.Direct == Direct.West) {
            this.Position.CenterX -= 0.1;
        } else if(this.Direct == Direct.East) {
            this.Position.CenterX += 0.1;
        } else if(this.Direct == Direct.North) {
            this.Position.CenterY -= 0.1;
        } else if(this.Direct == Direct.South) {
            this.Position.CenterY += 0.1;
        }

        let x = Math.round(this.Position.CenterX * 10) / 10;
        let y = Math.round(this.Position.CenterY * 10) / 10;
        
        this.Position.CenterX = x;
        this.Position.CenterY = y;
    };
};

function canMoveNorth(x, y) {
    if(x == 0 || x == 25) {
        if(0 < y && 7 <= 7) {
            return true;
        } else if(19 < y && y <= 22) {
            return true;
        } else if(25 < y && y <= 28) {
            return true;
        } else {
            return false;
        };
    } else if(x == 2 || x == 23) {
        if(22 < y && y <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(x == 5 || x == 20) {
        if(0 < y && y <= 25) {
            return true;
        } else {
            return false;
        };
    } else if (x == 8 || x == 17) {
        if (4 < y && y <=7) {
            return true;
        } else if(10 < y && y <= 19) {
            return true;
        } else if(22 < y && y <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(x == 11 || x == 14) {
        if(0 < y && y <= 4) {
            return true;
        } else if(7 < y && y <= 10) {
            return true;
        } else if(19 < y && y <= 22) {
            return true;
        } else if(25 < y && y <= 28) {
            return true;
        } else {
            return false;
        };
    };
};