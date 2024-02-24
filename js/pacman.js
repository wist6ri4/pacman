/**
 * Pacmanクラス
 */
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

    // 初期位置へ戻る
    GoHome() {
        this.Position.CenterX = 12.5;
        this.Position.CenterY = 22;
        this.Direct = Direct.West;
        this.NextDirect = Direct.West;
    };

    // 移動
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

        // canMoveメソッドを使うため、四捨五入する
        let x = Math.round(this.Position.CenterX * 10) / 10;
        let y = Math.round(this.Position.CenterY * 10) / 10;
        this.Position.CenterX = x;
        this.Position.CenterY = y;

        // this.NextDirectが移動できる方向の場合、this.Directに方向を代入する
        if(canMoveNorth(x, y) && this.NextDirect == Direct.Notrh) {
            this.Direct = Direct.North;
        } else if(canMoveSouth(x, y) && this.NextDirect == Direct.South) {
            this.Direct = Direct.South;
        } else if(canMoveEast(x, y) && this.NextDirect == Direct.East) {
            this.Direct = Direct.East;
        } else if(canMoveWest(x, y) && this.NextDirect == Direct.West) {
            this.Direct = Direct.West;
        };

        // 移動先がワープトンネルの場合、反対側から出てくる
        if((x == 0 && y == 13) && this.Direct == Direct.West) {
            this.Position.CenterX = 25;
        } else if((x == 25 && y == 13) && this.Direct == Direct.East) {
            this.Position.CenterX = 0;
        };

        // this.Directが移動できない方向の場合、this.DirectにDirect.Noneを代入して停止する
        if(!canMoveNorth(x, y) && this.Direct == Direct.North) {
            this.Direct = Direct.None;
        } else if(!canMoveSouth(x, y) && this.Direct == Direct.South) {
            this.Direct = Direct.None;
        } else if(!canMoveEast(x, y) && this.Direct == Direct.East) {
            this.Direct = Direct.None;
        } else if(!canMoveWest(x, y) && this.Direct == Direct.West) {
            this.Direct = Direct.None;
        };

        // パックマンがエサを食べたかを判定
        checkEatDot();
        // パックマンがモンスターと接触したかを判定
        checkHitMonster();

        // 移動に成功した場合、this.PrevDirectに方向を保存
        if(this.Direct != Direct.None) {
            this.PrevDirect = this.Direct;
        };
    };

    // パックマンの方向から対応する画像を取得
    GetImageFromDirect(direct) {
        if(direct == Direct.North) {
            return pacmanUpImage;
        } else if(direct == Direct.South) {
            return pacmanDownImage;
        } else if(direct == Direct.East) {
            return pacmanRightImage;
        } else if(direct == Direct.West) {
            return pacmanRightImage;
        } else {
            return pacmanRightImage;
        };
    };

    // パックマンの描画
    Draw() {
        /* 他のところで以下を定義
        const offsetX = 40;
        const offsetY = 60;
        const magnification = 18.0;
        const charactorSize = 35;
        */

        // パックマンの中心座標をもとに、パックマンの左上の座標を求める
        let x = this.Position.CenterX * magnification - charactorSize / 2 + offsetX;
        let y = this.Position.CenterY * magnification - charactorSize / 2 + offsetY;
        
        // パックマンのthis.DirectがDirect.Noneの場合、this.PrevDirectから対応する画像を取得
        let pacmanImage = pacmanNorthImage;
        if(this.Direct != Direct.None) {
            pacmanImage = this.GetImageFromDirect(this.Direct);
        } else {
            pacmanImage = this.GetImageFromDirect(this.PrevDirect);
        };

        // 描画
        context.drawImage(pacmanIamge, x, y, charactorSize, charactorSize);
    };
};

/**
 * 北へ行けるかを判定する
 * @param {*} x X軸
 * @param {*} y Y軸
 * @returns 判定結果
 */
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
    return false;
};

/**
 * 南へ行けるかを判定する
 * @param {*} x X軸
 * @param {*} y y軸
 * @returns 判定結果
 */
function canMoveSouth(x, y) {
    if(x == 0 || x == 25) {
        if(0 <= y && y < 7) {
            return true;
        } else if(19 <= y && y < 22) {
            return true;
        } else if(25 <= y && y < 28) {
            return true;
        } else {
            return false;
        };
    } else if(x == 2 || x == 23) {
        if(22 <= y && y < 25) {
            return true;
        } else {
            return false;
        };
    } else if(x == 5 || x == 20) {
        if(0 <= y && y < 25) {
            return true;
        } else {
            return false;
        };
    } else if(x == 8 || x == 17) {
        if(4 <= y && y < 7) {
            return true;
        } else if(10 <= y && y < 10) {
            return true;
        } else if(22 <= y && y < 25) {
            return true;
        } else {
            return false;
        };
    } else if(x == 11 || x == 14) {
        if(0 <= y && y < 4) {
            return true;
        } else if(7 <= y && y < 10) {
            return true;
        } else if(19 <= y && y < 22) {
            return true;
        } else if(25 <= y && y < 28) {
            return true;
        } else {
            return false;
        };
    };
    return false;
};

/**
 * 東へ行けるかを判定する
 * @param {*} x X軸 
 * @param {*} y Y軸
 * @returns 判定結果
 */
function canMoveEast(x, y) {
    if(y == 0) {
        if(0 <= x && x < 11) {
            return true;
        } else if(14 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 4) {
        if(0 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 7) {
        if(0 <= x && x < 5) {
            return true;
        } else if(8 <= x && x < 11) {
            return true;
        } else if(14 <= x && x < 17) {
            return true;
        } else if(20 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 13) {
        if(0 <= x && x < 8) {
            return true;
        } else if(17 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 16) {
        if(8 <= x && x < 17) {
            return true;
        } else {
            return false;
        };
    } else if(y == 19) {
        if(0 <= x && x < 11) {
            return true;
        } else if(14 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 22) {
        if(0 <= x && x < 2) {
            return true;
        } else if(5 <= x && x < 20) {
            return true;
        } else if(23 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 25) {
        if(0 <= x && x < 5) {
            return true;
        } else if(8 <= x && x < 11) {
            return true;
        } else if( 14 <= x && x < 17) {
            return true;
        } else if(20 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    } else if(y ==28) {
        if(0 <= x && x < 25) {
            return true;
        } else {
            return false;
        };
    };
    return false;
};

/**
 * 西へ行けるかを判定する
 * @param {*} x X軸
 * @param {*} y Y軸
 * @returns 判定結果
 */
function canMoveWest(x, y) {
    if(y == 0) {
        if(0 <= x && x <= 11) {
            return true;
        } else if(14 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 4) {
        if(0 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 7) {
        if(0 < x && x <= 5) {
            return true;
        } else if(8 < x && x <=11) {
            return true;
        } else if(14 < x && x <= 17) {
            return true;
        } else if(20 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 10) {
        if(8 < x && x <= 17) {
            return true;
        } else {
            return false;
        };
    } else if(y == 13) {
        if(0 < x && x <= 8) {
            return true;
        } else if(17 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 16) {
        if(8 < x && x <= 17) {
            return true;
        } else {
            return false;
        };
    } else if(y == 19) {
        if(0 < x && x <= 11) {
            return true;
        } else if(14 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 22) {
        if(0 < x && x <= 2) {
            return true;
        } else if(5 < x && x <= 20) {
            return true;
        } else if(23 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 25) {
        if(0 < x && x <= 5) {
            return true;
        } else if(8 < x && x <= 11) {
            return true;
        } else if(14 < x && x <= 17) {
            return true;
        } else if(20 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    } else if(y == 28) {
        if(0 < x && x <= 25) {
            return true;
        } else {
            return false;
        };
    };
    return false;
};