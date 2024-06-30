class Monster {
    Id = 0;
    InitPosition = null;
    Position = null;
    Direct = Direct.None;
    StandbyCount = 0;
    IsIjike = false;

    constructor(id, x, y, direct) {
        this.Id = id;
        this.InitPosition = new Position();
        this.Position = new Position();

        this.InitPosition.CenterX = x;
        this.InitPosition.CenterY = y;
        this.Position.CenterX = x;
        this.Position.CenterY = y;

        this.Direct = direct;
    };

    Move() {
        this.Position.CenterX = Math.round(this.Position.CenterX * 10) / 10;
        this.Position.CenterY = Math.round(this.Position.CenterY * 10) / 10;

        // 角にいる場合進行方向を変える
        if(this.IsCrossPosition() || this.Direct == Direct.None) {
            let directs = this.GetDirectsMonsterMove();
            if(directs.length == 1) {
                this.Direct = directs[0];
            } else if(directs.length > 1) {
                let index = Math.floor((Math.random() * directs.length));
                this.Direct = directs[index];
            };
        };

        // 巣の中にいる場合前後に移動させる
        if(this.IsMonsterInHome()) {
            this.MonsterMoveInHome();
        };

        // 巣から出た直後に進路選択をする
        if(this.Direct == Direct.North && this.Position.CenterX == 12.5 && this.Positon.CenterY == 10) {
            if(Math.random() < 0.5) {
                this.Direct = Direct.West;
            } else {
                this.Direct = Direct.East;
            };
        };

        // 移動させる
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

        // ワープさせる
        if((this.Position.CenterX == 0 && this.Position.CenterY == 13) && this.Direct == Direct.West) {
            this.Position.CenterX = 25;
        };
        if((this.Position.CenterX == 25 && this.Position.CenterY == 13) && this.Direct == Direct.East) {
            this.Position.CenterX = 0;
        };

        // イジケ状態から回復させる
        if(CounterattackTime <= 0) {
            this.IsIjike = false;
        };
    };

    // モンスターが曲がり角・十字路・丁字路にいるか判定
    IsCrossPosition() {
        let x = this.Position.CenterX;
        let y = this.Position.CenterY;
        if(y == 0) {
            if(x == 0 || x == 5 || x == 11 || x == 14 || x == 20 || x == 25) {
                return true;
            };
            return false;
        };
        if(y == 4) {
            if(x == 0 || x == 5 || x == 11 || x == 14 || x == 17 || x == 20 || x == 25) {
                return true;
            };
            return false;
        };
        if(y == 7) {
            if(x == 0 || x == 5 || x == 11 || x == 14 || x == 17 || x == 20 || x == 25) {
                return true;
            };
            return false;
        };
        if(y == 10) {
            if(x == 8 || x == 11 || x == 14 || x == 17) {
                return true;
            };
            return false;
        };
        if(y == 13) {
            if(x == 5 || x == 8 || x == 17 || x == 20) {
                return true;
            };
            return false;
        };
        if(y == 16) {
            if(x == 8 || x == 17) {
                return true;
            };
            return false;
        };
        if(y == 19) {
            if(x == 0 || x == 5 || x == 8 || x == 11 || x == 14 || x == 17 || x == 20 || x == 25) {
                return true;
            };
            return false;
        };
        if(y == 22) {
            if(x == 0 || x == 2 || x == 5 || x == 8 || x == 11 || x == 14 || x == 17 || x == 20 || x == 23 || x == 25) {
                return true;
            };
            return false;
        };
        if(y == 25) {
            if(x == 0 || x == 2 || x == 5 || x == 8 || x == 11 || x == 14 || x == 17 || x == 20 || x == 23 || x == 25) {
                return true;
            };
            return false;
        };
        if(y == 28) {
            if(x == 0 || x == 11 || x == 14 || x == 25) {
                return true;
            };
            return false;
        };
        return false;
    };

    // モンスターが進行可能な方向の配列を取得
    GetDirectsMonsterMove() {
        let x = this.Position.CenterX;
        let y = this.Position.CenterY;

        let ret = [];
        if(this.IsCrossPosition()) {
            if(CanMoveNorth(x, y) && this.Direct != Direct.South) {
                ret.push(Direct.North);
            };
            if(CanMoveEast(x, y) && this.Direct != Direct.West) {
                ret.push(Direct.East);
            };
            if(CanMoveSouth(x, y) && this.Direct != Direct.North) {
                ret.push(Direct.South);
            };
            if(CanMoveWest(x, y) && this.Direct != Direct.East) {
                ret.push(Direct.West);
            };
        } else {
            if(CanMoveNorth(x, y)) {
                ret.push(Direct.North);
            };
            if(CanMoveEast(x, y)) {
                ret.push(Direct.East);
            };
            if(CanMoveSouth(x, y)) {
                ret.push(Direct.South);
            };
            if(CanMoveWest(x, y)) {
                ret.push(Direct.West);
            };
        };
        return ret;
    };

    // モンスターが巣にいるかどうか判定
    IsMonsterInHome() {
        if(8 < this.Position.CenterX && this.Position.CenterX < 17 && 10 < this.Position.CenterY && this.Position.CenterY < 16) {
            return true;
        } else {
            return false;
        };
    };

    // 巣の中にいるモンスターを上下移動
    MonsterMoveInHome() {
        if(this.StandbyCount == 0) {
            // this.StandbyCountが0になったら巣の中央から外に移動させる
            if(this.Position.CenterX == 12.5 && this.Position.CenterY > 10) {
                this.Direct = Direct.North;
            } else if(this.Position.CenterX < 12.5) {
                this.Direct = Direct.East;
            } else if(this.Position.CenterX > 12.5) {
                this.Direct = Direct.West;
            };
        } else {
            // this.StandbyCountが0よりも大きいときは上下に移動
            if(this.Position.CenterY == 12) {
                this.Direct = Direct.South;
            };
            if(this.Position.CenterY == 14) {
                this.Direct = Direct.North;
                this.StandbyCount--;
            };
        };
    };

    // パックマンがパワー餌を食べたときに方向転換させる
    ReverseMove() {
        if(this.IsMonsterInHome()) {
            return;
        };
        if(this.Direct == Direct.North && CanMoveSouth(this.Position.CenterX, this.Position.CenterY)) {
            this.Direct = Direct.South;
        } else if(this.Direct == Direct.South && CanMoveNorth(this.Position.CenterX, this.Position.CenterY)) {
            this.Direct = Direct.North;
        } else if(this.Direct == Direct.East && CanMoveWest(this.Position.CenterX, this.Position.CenterY)) {
            this.Direct = Direct.West;
        } else if(this.Direct == Direct.West && CanMoveEast(this.Position.CenterX, this.Position.CenterY)) {
            this.Direct = Direct.East;
        };
    };

    // パックマンに駆逐されたモンスターを巣の中に移動させる
    GoHome() {
        this.Position.CenterX = 12.5;
        this.Position.CenterY = 13;
        this.Direct = Direct.North;
        this.IsIjike = false;
    };

    // 描画
    Draw() {
        let monsterImage = monsterImages[this.Id];

        if(this.IsIjike) {
            if(CounterattackTime > 5000 || stoping) {
                monsterImage = ijikeImages[0];
            } else {
                if(CounterattackTime % 1000 < 500) {
                    monsterImage = ijikeImages[0];
                } else {
                    monsterImage = ijikeImages[0];
                };
            };
        };

        // 別のところで
        // const offsetX = 40; const offsetY = 60;
        // const magnification = 18.0; const charctorSize = 35;と定義されている
        let x = this.Position.CenterX * magnification - charctorSize / 2 + offsetX;
        let y = this.Position.CenterY * magnification - charctorSize / 2 + offsetY;
        con.drawImage(monsterImage, x, y, charctorSize, charctorSize);
    };
};