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
        };
        if(this.Direct == Direct.East) {
            this.Position.CenterX += 0.1;
        };
        if(this.Direct == Direct.North) {
            this.Position.CenterY -= 0.1;
        };
        if(this.Direct == Direct.South) {
            this.Position.CenterY += 0.1;
        };

        // CanMoveメソッドを使うため、四捨五入する
        let x = Math.round(this.Position.CenterX * 10) / 10;
        let y = Math.round(this.Position.CenterY * 10) / 10;
        this.Position.CenterX = x;
        this.Position.CenterY = y;

        // this.NextDirectが移動できる方向の場合、this.Directに方向を代入する
        if(CanMoveNorth(x, y) && this.NextDirect == Direct.North) {
            this.Direct = Direct.North;
        };
        if(CanMoveSouth(x, y) && this.NextDirect == Direct.South) {
            this.Direct = Direct.South;
        };
        if(CanMoveEast(x, y) && this.NextDirect == Direct.East) {
            this.Direct = Direct.East;
        };
        if(CanMoveWest(x, y) && this.NextDirect == Direct.West) {
            this.Direct = Direct.West;
        };

        // 移動先がワープトンネルの場合、反対側から出てくる
        if((x == 0 && y == 13) && this.Direct == Direct.West) {
            this.Position.CenterX = 25;
        };
        if((x == 25 && y == 13) && this.Direct == Direct.East) {
            this.Position.CenterX = 0;
        };

        // this.Directが移動できない方向の場合、this.DirectにDirect.Noneを代入して停止する
        if(!CanMoveNorth(x, y) && this.Direct == Direct.North) {
            this.Direct = Direct.None;
        };
        if(!CanMoveSouth(x, y) && this.Direct == Direct.South) {
            this.Direct = Direct.None;
        };
        if(!CanMoveEast(x, y) && this.Direct == Direct.East) {
            this.Direct = Direct.None;
        };
        if(!CanMoveWest(x, y) && this.Direct == Direct.West) {
            this.Direct = Direct.None;
        };

        // パックマンがエサを食べたかを判定
        CheckEatDot();
        // パックマンがモンスターと接触したかを判定
        CheckHitMonster();

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
            return pacmanLeftImage;
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
        let pacmanImage = pacmanUpImage;
        if(this.Direct != Direct.None) {
            pacmanImage = this.GetImageFromDirect(this.Direct);
        } else {
            pacmanImage = this.GetImageFromDirect(this.PrevDirect);
        };

        // 描画
        context.drawImage(pacmanImage, x, y, charactorSize, charactorSize);
    };
};