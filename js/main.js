/**
 * グローバル変数
 */
// 画面
let canvas = null; // HTMLのcanvas（document.getElementById('canvas-pacman')）
let context = null; // canvasに描画するためのオブジェクト（getContext('2d')）

// 迷路を表示する場所
const offsetX = 40; // x座標
const offsetY = 60; // y座標

const magnification = 18.0; // 拡大用の定数

// dot関連
const dotSize = 4; // dotサイズの定数
let dots = []; // dot格納用配列
let powerDots = []; // powerdot格納用配列

// pacman関連
const charactorSize = 35; // キャラクターサイズの定数
let pacman = null; // pacmanオブジェクト
let pacmanUpImage = null; // pacman北向きの画像
let pacmanDownImage = null; // pacman南向きの画像
let pacmanRightImage = null; // pacman東向きの画像
let pacmanLeftImage = null; // pacman西向きの画像

// monster関連
let monsters = []; // monsterオブジェクト
let monsterImages = []; // monsterの画像
let ijikeImages = []; // ijikeの画像
let moveCount = 0;

// 強化ドットの効果時間
let CounterattackTime = 0;
let CounterattackTimeMax = 10 * 1000;

// ゲームのシステム情報
let score = 0; // スコア
let rest = 3; // 開始時残機
let restMax = 3; // 残機最大数
let isGameOver = false; // ゲームオーバーの判定
let stoping = false; // 各キャラクターの停止判定
let eatMonsterCount = 0; // モンスターを食べた回数


/**
 * 画面起動時にメインメソッドを呼び出し
 */
Main();

/**
 * メインメソッド
 */
function Main() {
    // 画面情報設定
    canvas = document.getElementById('canvas-pacman');
    context = canvas.getContext('2d');

    canvas.width = offsetX * 2 + magnification * 25;
    canvas.height = offsetY * 2 + magnification * 28;
    canvas.style.border = '1px solid #111';

    // pacmanのイメージの取得
    pacmanUpImage = GetHTMLImageElement("./img/Pacman_Up.png");
    pacmanDownImage = GetHTMLImageElement("./img/Pacman_Down.png");
    pacmanRightImage = GetHTMLImageElement("./img/Pacman_Right.png");
    pacmanLeftImage = GetHTMLImageElement("./img/Pacman_Left.png");

    // monsterのイメージの取得
    monsterImages.push(GetHTMLImageElement("./img/Ghosts_Inky.png"));
    monsterImages.push(GetHTMLImageElement("./img/Ghosts_Pinky.png"));
    monsterImages.push(GetHTMLImageElement("./img/Ghosts_Blinky.png"));
    monsterImages.push(GetHTMLImageElement("./img/Ghosts_Clyde.png"));
    ijikeImages.push(GetHTMLImageElement("./img/ijike1.png"));
    ijikeImages.push(GetHTMLImageElement("./img/ijike2.png"));

    // 残機の設定
    rest = restMax;

    // pacmanオブジェクト生成と初期化
    pacman = new Pacman();
    pacman.GoHome();

    // monsterオブジェクト生成と初期化
    MonstersInit();

    // dotオブジェクト生成と初期化
    CreateDots();
    CreatePowerDots();

    // 方向キーの判定
    document.onkeydown = OnKeyDown;

    // pacmanとmonsterの移動
    setInterval(PacmanMove, 15);
    setInterval(MoveMonsters, 15);

    // ゲーム本体を0.01秒ごとに描画
    setInterval(Draw, 10);

    // 強化ドットの効果時間設定
    setInterval(() => {
        if(CounterattackTime > 0)
            CounterattackTime -= 100;
    }, 100);
};

/**
 * ゲーム本体の描画
 */
function Draw() {
    DrawMazes(); // 迷路描画
    DrawDots(); // ドット描画
    DrawPowerDots(); // 強化ドット描画

    if(!isGameOver) {
        DrawPac(); // パックマン描画
    };

    DrawMonsters(); // モンスター描画
    DrawScore(); // スコア描画
    DrawRest(); // 残機描画

    // ゲームオーバーの場合、画面に「GAME OVER」を表示
    if(isGameOver) {
        context.fillStyle = "white";
        context.font = "28px 'ＭＳ ゴシック'"
        context.fillText("GAME OVER", offsetX + 170, offsetY+295, 250);
    };
};

/**
 * 迷路
 * =========================================================================
 */

/**
 * 迷路の描画
 */
function DrawMazes() {
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);

    DrawWalls(); // 壁の描画
    DrawAisles(); // 道の描画
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
    };
    if(x1 == x2) {
        y1 -= 0.8;
        y2 += 0.8;
    };

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
    };
    if(x1 == y2) {
        y1 -= 0.8;
        y2 += 0.8;
    };

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

/**
 * 北へ行けるかを判定する
 * @param {int} x X軸
 * @param {int} y Y軸
 * @returns 判定結果
 */
function CanMoveNorth(x, y) {
    if(x == 0 || x == 25) {
        if(0 < y && y <= 7)
            return true;
        if(19 < y && y <= 22)
            return true;
        if(25 < y && y <= 28)
            return true;
        return false;
    };
    if(x == 2 || x == 23) {
        if(22 < y && y <= 25)
            return true;
        return false;
    };
    if(x == 5 || x == 20) {
        if(0 < y && y <= 25)
            return true;
        return false;
    };
    if(x == 8 || x == 17) {
        if(4 < y && y <= 7)
            return true;
        if(10 < y && y <= 19)
            return true;
        if(22 < y && y <= 25)
            return true;
        return false;
    };
    if(x == 11 || x == 14) {
        if(0 < y && y <= 4)
            return true;
        if(7 < y && y <= 10)
            return true;
        if(19 < y && y <= 22)
            return true;
        if(25 < y && y <= 28)
            return true;
        return false;
    };
    return false;
};

/**
 * 南へ行けるかを判定する
 * @param {int} x X軸
 * @param {int} y y軸
 * @returns 判定結果
 */
function CanMoveSouth(x, y) {
    if(x == 0 || x == 25) {
        if(0 <= y && y < 7)
            return true;
        if(19 <= y && y < 22)
            return true;
        if(25 <= y && y < 28)
            return true;
        return false;
    };
    if(x == 2 || x == 23) {
        if(22 <= y && y < 25)
            return true;
        return false;
    };
    if(x == 5 || x == 20) {
        if(0 <= y && y < 25)
            return true;
        return false;
    };
    if(x == 8 || x == 17) {
        if(4 <= y && y < 7)
            return true;
        if(10 <= y && y < 19)
            return true;
        if(22 <= y && y < 25)
            return true;
        return false;
    };
    if(x == 11 || x == 14) {
        if(0 <= y && y < 4)
            return true;
        if(7 <= y && y < 10)
            return true;
        if(19 <= y && y < 22)
            return true;
        if(25 <= y && y < 28)
            return true;
        return false;
    };
    return false;
};

/**
 * 東へ行けるかを判定する
 * @param {int} x X軸 
 * @param {int} y Y軸
 * @returns 判定結果
 */
function CanMoveEast(x, y) {
    if(y == 0) {
        if(0 <= x && x < 11)
            return true;
        if(14 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 4) {
        if(0 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 7) {
        if(0 <= x && x < 5)
            return true;
        if(8 <= x && x < 11)
            return true;
        if(14 <= x && x < 17)
            return true;
        if(20 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 10) {
        if(8 <= x && x < 17)
            return true;
        return false;
    };
    if(y == 13) {
        if(0 <= x && x < 8)
            return true;
        if(17 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 16) {
        if(8 <= x && x < 17)
            return true;
        return false;
    };
    if(y == 19) {
        if(0 <= x && x < 11)
            return true;
        if(14 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 22) {
        if(0 <= x && x < 2)
            return true;
        if(5 <= x && x < 20)
            return true;
        if(23 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 25) {
        if(0 <= x && x < 5)
            return true;
        if(8 <= x && x < 11)
            return true;
        if(14 <= x && x < 17)
            return true;
        if(20 <= x && x < 25)
            return true;
        return false;
    };
    if(y == 28) {
        if(0 <= x && x < 25)
            return true;
        return false;
    };
    return false;
};

/**
 * 西へ行けるかを判定する
 * @param {int} x X軸
 * @param {int} y Y軸
 * @returns 判定結果
 */
function CanMoveWest(x, y) {
    if(y == 0) {
        if(0 < x && x <= 11)
            return true;
        if(14 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 4) {
        if(0 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 7) {
        if(0 < x && x <= 5)
            return true;
        if(8 < x && x <= 11)
            return true;
        if(14 < x && x <= 17)
            return true;
        if(20 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 10) {
        if(8 < x && x <= 17)
            return true;
        return false;
    };
    if(y == 13) {
        if(0 < x && x <= 8)
            return true;
        if(17 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 16) {
        if(8 < x && x <= 17)
            return true;
        return false;
    };
    if(y == 19) {
        if(0 < x && x <= 11)
            return true;
        if(14 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 22) {
        if(0 < x && x <= 2)
            return true;
        if(5 < x && x <= 20)
            return true;
        if(23 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 25) {
        if(0 < x && x <= 5)
            return true;
        if(8 < x && x <= 11)
            return true;
        if(14 < x && x <= 17)
            return true;
        if(20 < x && x <= 25)
            return true;
        return false;
    };
    if(y == 28) {
        if(0 < x && x <= 25)
            return true;
        return false;
    };
    return false;
};

/**
 * パックマン
 * =========================================================================
 */

/**
 * pacmanの移動
 * @returns 
 */
function PacmanMove() {
    if(stoping)
        return;

    pacman.Move();
};

/**
 * キーボード押下時のpacman移動メソッド
 * @param {object} e キーボードイベント
 */
function OnKeyDown(e) {
    if(e.keyCode == 37)
        pacman.NextDirect = Direct.West;
    if(e.keyCode == 38)
        pacman.NextDirect = Direct.North;
    if(e.keyCode == 39)
        pacman.NextDirect = Direct.East;
    if(e.keyCode == 40)
        pacman.NextDirect = Direct.South;
    if(e.keyCode == 83 && isGameOver == true)
        GameRetart();
};

/**
 * pacmanの描画
 */
function DrawPac() {
    pacman.Draw();
};

/**
 * モンスター
 * =========================================================================
 */

/**
 * monsterの移動メソッド
 * @returns 
 */
function MoveMonsters() {
    if(stoping) {
        return;
    };

    // moveCountが大きくなりすぎないようにときどきリセットする
    moveCount++;
    if(moveCount >= 10000) {
        moveCount = 0;
    };

    for(let i = 0; i < monsters.length; i++) {
        let monster = monsters[i];

        // イジケ状態のときは2回に1回しかmonster.Move()が実行しない
        if(!monster.IsIjike || (moveCount % 2 == 0))
            monster.Move();
    };
};

/**
 * モンスターの初期化
 * 最初は赤のみ
 */
function MonstersInit() {
    monsters = [];
    monsters.push(new Monster(0, 12.5, 10, Direct.None));
    monsters.push(new Monster(1, 12.5, 13, Direct.South));
    monsters.push(new Monster(2, 10, 13, Direct.North));
    monsters.push(new Monster(3, 15, 13, Direct.North));

    SetMonstersStandbyCount([0, 3, 6, 10]);
};

/**
 * 順番にモンスターを出現させるメソッド
 * @param {*} counts 
 */
function SetMonstersStandbyCount(counts) {
    let count = monsters.length;
    for(let i = 0; i < count; i++) {
        if(counts.length >= i)
            monsters[i].StandbyCount = counts[i];
    };
};

/**
 * monsterの描画
 */
function DrawMonsters() {
    monsters.forEach(monster => {monster.Draw()});
};

/**
 * ドット
 * =========================================================================
 */

/**
 * Dotオブジェクトの生成メソッド
 */
function CreateDots() {
    for(let x = 0; x <= 11; x++)
        dots.push(new Dot(x, 0));
    for(let x = 14; x <= 25; x++)
        dots.push(new Dot(x, 0));
    for(let y = 1; y <= 3; y++) {
        if(y != 2)
            dots.push(new Dot(0, y));
        dots.push(new Dot(5, y));
        dots.push(new Dot(11, y));
        dots.push(new Dot(14, y));
        dots.push(new Dot(20, y));
        if(y != 2)
            dots.push(new Dot(25, y));
    };
    for(let x = 0; x <= 25; x++)
        dots.push(new Dot(x, 4));
    for(let y = 5; y <= 6; y++) {
        dots.push(new Dot(0, y));
        dots.push(new Dot(5, y));
        dots.push(new Dot(8, y));
        dots.push(new Dot(17, y));
        dots.push(new Dot(20, y));
        dots.push(new Dot(25, y));
    };
    for(let x = 0; x <= 5; x++)
        dots.push(new Dot(x, 7));
    for(let x = 8; x <= 11; x++)
        dots.push(new Dot(x, 7));
    for(let x = 14; x <= 17; x++)
        dots.push(new Dot(x, 7));
    for(let x = 20; x <= 25; x++)
        dots.push(new Dot(x, 7));
    for(let y = 8; y <= 18; y++) {
        dots.push(new Dot(5, y));
        dots.push(new Dot(20, y));
    };
    for(let x = 0; x <= 11; x++)
        dots.push(new Dot(x, 19));
    for(let x = 14; x <= 25; x++)
        dots.push(new Dot(x, 19));
    for(let y = 20; y <= 21; y++) {
        dots.push(new Dot(0, y));
        dots.push(new Dot(5, y));
        dots.push(new Dot(11, y));
        dots.push(new Dot(14, y));
        dots.push(new Dot(20, y));
        dots.push(new Dot(25, y));
    };
    for(let x = 1; x <= 2; x++)
        dots.push(new Dot(x, 22));
    for(let x = 5; x <= 20; x++)
        dots.push(new Dot(x, 22));
    for(let x = 23; x <= 24; x++)
        dots.push(new Dot(x, 22));
    for(let y = 23; y <= 24; y++) {
        dots.push(new Dot(2, y));
        dots.push(new Dot(5, y));
        dots.push(new Dot(8, y));
        dots.push(new Dot(17, y));
        dots.push(new Dot(20, y));
        dots.push(new Dot(23, y));
    };
    for(let y = 26; y <= 27; y++) {
        dots.push(new Dot(0, y));
        dots.push(new Dot(11, y));
        dots.push(new Dot(14, y));
        dots.push(new Dot(25, y));
    };
    for(let x = 0; x <= 5; x++)
        dots.push(new Dot(x, 25));
    for(let x = 8; x <= 11; x++)
        dots.push(new Dot(x, 25));
    for(let x = 14; x <= 17; x++)
        dots.push(new Dot(x, 25));
    for(let x = 20; x <= 25; x++)
        dots.push(new Dot(x, 25));
    for(let x = 0; x <= 25; x++)
        dots.push(new Dot(x, 28));
};

/**
 * ドットオブジェクトの描画メソッド
 */
function DrawDots() {
    for(let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        if(!dot.IsEaten) {
            context.fillStyle = "white";
            let x = dot.X * magnification - dotSize / 2 + offsetX;
            let y = dot.Y * magnification - dotSize / 2 + offsetY;
            context.fillRect(x, y, dotSize, dotSize);
        };
    };
};

/**
 * 強化ドットオブジェクトの生成メソッド
 */
function CreatePowerDots() {
    powerDots.push(new PowerDot(0, 2));
    powerDots.push(new PowerDot(25, 2));
    powerDots.push(new PowerDot(0, 22));
    powerDots.push(new PowerDot(25, 22));
};

/**
 * 強化ドットオブジェクトの描画メソッド
 */
function DrawPowerDots() {
    for(let i = 0; i < powerDots.length; i++) {
        let dot = powerDots[i];
        if(!dot.IsEaten) {
            let dotSize = 8;
            context.fillStyle = "yellow";
            let x = dot.X * magnification - dotSize / 2 + offsetX;
            let y = dot.Y * magnification - dotSize / 2 + offsetY;
            context.fillRect(x, y, dotSize, dotSize);
        };
    };
};

/**
 * ドットを食べたか判定するメソッド
 */
function CheckEatDot() {
    let dot = dots.find(dot => dot.X == pacman.Position.CenterX && dot.Y == pacman.Position.CenterY);
    if(dot != null) {
        if(!dot.IsEaten) {
            dot.IsEaten = true;
            OnEatDot();
        };
    };

    let powerDot = powerDots.find(dot => dot.X == pacman.Position.CenterX && dot.Y == pacman.Position.CenterY);
    if(powerDot != null) {
        if(!powerDot.IsEaten) {
            powerDot.IsEaten = true;
            OnEatPowerDot();
        };
    };
};

/**
 * ドットを食べたとき
 */
function OnEatDot() {
    score += 10;
    if(CheckStageClear()) {
        OnStageClear();
    };
};

/**
 * 強化ドットを食べたとき
 */
function OnEatPowerDot() {
    score += 50;
    eatMonsterCount = 0;

    if(CheckStageClear()) {
        OnStageClear();
    } else {
        // モンスターをいじけ状態にする
        monsters.forEach(monster => {
            monster.IsIjike = true;
            monster.ReverseMove();
        });
        CounterattackTime = CounterattackTimeMax;
    };
};

/**
 * 強化ドットの効果切れのとき
 */
function OnFinishCounterattack() {
    monsters.forEach(monster => monster.IsIjike = false);
};

/**
 * ゲームシステム
 * =========================================================================
 */

/**
 * イメージ画像の取得
 * @param {画像パス} string 
 * @returns 画像
 */
function GetHTMLImageElement(path) {
    let img = new Image();
    img.src = path;
    return img;
};

/**
 * スコアの表示
 */
function DrawScore() {
    let strScore = "";
    if(score < 10000) {
        strScore = ('00000' + score).slice(-5);
    } else {
        strScore = score.toString();
    };    

    context.fillStyle = "white";
    context.font = "24px 'ＭＳ ゴシック'";
    context.fillText(strScore, offsetX - 10, offsetY-30, 200);
};

/**
 * 残機の表示
 */
function DrawRest() {
    for(let i = 0; i < rest-1; i++)
        context.drawImage(pacmanRightImage, offsetX + 110 + 25 * i, offsetY-53, charactorSize * 0.7, charactorSize * 0.7);
};

/**
 * ゲームリスタート
 */
function GameRetart() {
    rest = restMax; // 残機を初期化する
    score = 0;      // スコアを初期化する

    // パックマンとモンスターをゲーム開始の位置に戻す
    pacman.GoHome();
    MonstersInit();

    // 餌とパワー餌を食べられていない状態に戻す
    dots.forEach(dot => dot.IsEaten = false);
    powerDots.forEach(dot => dot.IsEaten = false);
    isGameOver = false;

    // 3秒後にゲーム再開！
    setTimeout(() => { stoping = false; }, 3000);
};

/**
 * モンスターの当たり判定
 */
function CheckHitMonster() {
    for(let i = 0; i < monsters.length; i++) {
        let monster = monsters[i];
        if(IsHitMonster(monster)) {
            if(monster.IsIjike) {
                EatMonster(monster);
            } else {
                PacmanDead();
                break;
            };
        };
    };
};

/**
 * モンスターにあたったかを判定するメソッド
 * @param {Monster} monster 
 * @returns 
 */
function IsHitMonster(monster) {
    let x2 = (pacman.Position.CenterX - monster.Position.CenterX) ** 2;
    let y2 = (pacman.Position.CenterY - monster.Position.CenterY) ** 2;
    if(x2 + y2 < 1) {
        return true;
    } else {
        return false;
    };
};

/**
 * イジケを食べたとき
 * @param {Monster} monster 
 */
function EatMonster(monster) {
    stoping = true;
    CounterattackTime += 1000; // モンスターを食べたあと1秒間動作を止めるので、その分追加する
    eatMonsterCount++;
    score += (2 ** eatMonsterCount) * 100;
    setTimeout(AfterEatMonster, 1000, monster);
};

/**
 * イジケを食べた後に実行するメソッド
 * @param {Monster} monster 
 */
function AfterEatMonster(monster) {
    monster.GoHome();
    stoping = false;
};

/**
 * モンスターに接触したとき
 */
function PacmanDead() {
    stoping = true;
    setTimeout(AfterPacmanDead, 3000);
};

/**
 * モンスターに接触した後に実行するメソッド
 */
function AfterPacmanDead() {
    rest--;
    if(rest > 0) {
        pacman.GoHome();
        MonstersInit();
        stoping = false;
    } else {
        isGameOver = true;
    };
};


/**
 * ステージクリアかどうかを判定するメソッド
 * @returns 
 */
function CheckStageClear() {
    let dot = dots.find(dot => !dot.IsEaten);
    let powerDot = powerDots.find(dot => !dot.IsEaten);
    if(dot == null && powerDot == null) {
        return true;
    } else {
        return false;
    };
};

/**
 * ステージクリアの場合
 */
function OnStageClear() {
    stoping = true;
    setTimeout(AfterStageClear, 3000);
};

/**
 * ステージクリア後に実行するメソッド
 */
function AfterStageClear() {
    pacman.GoHome();
    MonstersInit();
    dots.forEach(dot => dot.IsEaten = false);
    powerDots.forEach(dot => dot.IsEaten = false);
    stoping = false;
};