const canvasContainer = document.getElementById("gobang");
const canvas = document.createElement("canvas");

const cWidth = canvasContainer.clientWidth;
const cHeight = canvasContainer.clientHeight;
const cellNum = 15;
const lianzhuNum = 5;
const direction = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
const PieceMode = { None: 0, Black: 1, White: 2 };
const GameMode = { Noplay: 0, PvC: 1, PvP: 2 };
const SingleTypes = {
    WP: 0, OXP: 1, WXP: 2, OXXP: 3, WXXP: 4, OXXXP: 5, WXXXP: 6, OXXXXP: 7, WXXXXP: 8, WOOP: 9, WOP: 10, OP: 11, WXOP: 12, OXOP: 13, WXXOP: 14, OXXOP: 15, WXXXOP: 16, OXOXP: 17
};
const Categorys = {
    MakeKill: 0, AliveFour: 1, LongFive: 2, RushFour: 3, AliveThree: 4, SleepThree: 5, AliveTwo: 6, JumpTwo: 7, MiddleTwo: 8, SideTwo: 9, SleepTwo: 10, AliveOne: 11, SleepOne: 12, ThreeThree: 13, FourThree: 14, FourFour: 15
};
var chessMap = [];
var chessOrder = [];
var scoreMap = [];
var startX = 0, startY = 0;
var cellSize = 50;
var pieceR = 22;
var order = 0;
var pieceMode = 0;
var gameMode = GameMode.PvC;

canvas.width = cWidth;
canvas.height = cHeight;
canvasContainer.appendChild(canvas);
const context = canvas.getContext('2d');

boardCalculation();
boardDraw();
createNewChessBoard();
mousePressEvent();

function boardCalculation() {
    var boardLength = cHeight - 21;
    var exLength = boardLength % cellNum;
    cellSize = boardLength / cellNum;
    pieceR = cellSize / 2 - cellSize / 15;
    startX += (cWidth - boardLength + exLength) / 2 + pieceR + 15 + cellSize / 15;
    startY += exLength / 2 + pieceR + 10 + cellSize / 15;
    cellSize = Math.round(cellSize);
    pieceR = Math.round(pieceR);
    startX = Math.round(startX);
    startY = Math.round(startY);
}

function boardDraw() {
    context.rect(startX - 5, startY - 5, (cellNum - 1) * cellSize + 10, (cellNum - 1) * cellSize + 10);
    context.fillStyle = "#fdea7b";
    context.fill();
    context.stroke();

    for (let i = 0; i < cellNum; i++) {
        context.moveTo(cellSize * i + startX, startY);
        context.lineTo(cellSize * i + startX, (cellNum - 1) * cellSize + startY);
        context.stroke();

        context.moveTo(startX, cellSize * i + startY);
        context.lineTo((cellNum - 1) * cellSize + startX, cellSize * i + startY);
        context.stroke();
    }
}

function createNewChessBoard() {
    for (var i = 0; i < cellNum; i++) {
        chessMap[i] = [];
        for (var j = 0; j < cellNum; j++) {
            chessMap[i][j] = 0;
        }
    }

    for (var i = 0; i < Math.pow(cellNum, 2); i++) {
        chessOrder[i] = [];
        for (var j = 0; j < 2; j++) {
            chessOrder[i][j] = 0;
        }
    }

    pieceMode = PieceMode.Black;
}

function mousePressEvent() {
    canvas.addEventListener('click', e => {
        let { offsetX: x, offsetY: y } = e;

        var cx = x - startX;
        var cy = y - startY;

        var pieceDX = ((cx % cellSize) > (cellSize / 2) ? cellSize : 0) - cx % cellSize;
        var pieceDY = ((cy % cellSize) > (cellSize / 2) ? cellSize : 0) - cy % cellSize;

        var pieceX = (cx / cellSize + ((cx % cellSize) > (cellSize / 2)));
        var pieceY = (cy / cellSize + ((cy % cellSize) > (cellSize / 2)));

        pieceX = Math.floor(pieceX);
        pieceY = Math.floor(pieceY);

        var pieceDistance = Math.sqrt(Math.pow(pieceDX, 2) + Math.pow(pieceDY, 2));

        pieceX = (pieceX >= 0 && pieceX < cellNum && pieceDistance <= pieceR) ? pieceX : -1;
        pieceY = (pieceY >= 0 && pieceY < cellNum && pieceDistance <= pieceR) ? pieceY : -1;

        if (pieceX != -1 && pieceY != -1 && chessMap[pieceX][pieceY] == PieceMode.None) {
            chessMap[pieceX][pieceY] = pieceMode;
            chessOrder[order][0] = pieceX;
            chessOrder[order][1] = pieceY;
            order++;
            pieceDraw(pieceX, pieceY, pieceMode);
            chessPlaying();
        }
    }
    )
}

function chessPlaying() {
    if (!winnerJudgment()) {
        pieceMode = (pieceMode == PieceMode.Black) ? PieceMode.White : PieceMode.Black;
    }

    if (gameMode == GameMode.PvC && pieceMode == PieceMode.White) {
        AIPlay();
    }
}

function winnerJudgment() {
    if (order == Math.pow(cellNum, 2)) {
        winGame(PieceMode.None);
        return true;
    }
    else if (lianziJudgment()) {
        winGame(pieceMode);
        return true;
    }
    return false;
}

function winGame(pm) {
    if (pm == PieceMode.Black)
        confirm("黑子获胜！")
    else if (pm == PieceMode.White)
        confirm("白子获胜！")
    else
        confirm("平局！");
}

function lianziJudgment() {
    if (order == 0)
        return false;

    var directLine = [0, 0, 0, 0];

    for (var i = 0; i < 8; i++) {
        for (var j = 1; j < lianzhuNum; j++) {
            var px = chessOrder[order - 1][0] + j * direction[i][0];
            var py = chessOrder[order - 1][1] + j * direction[i][1];

            if (px < cellNum && px >= 0 && py < cellNum && py >= 0) {
                if (chessMap[px][py] == pieceMode) {
                    directLine[i % 4] += 1;
                    if (directLine[i % 4] == lianzhuNum - 1) {
                        return true;
                    }
                }
                else {
                    break;
                }
            }
        }
    }

    return false;
}

function pieceDraw(px, py, piecemode) {
    px = startX + px * cellSize;
    py = startY + py * cellSize;
    const gradient = context.createRadialGradient(px + Math.floor(pieceR * 2 / 5), py - Math.floor(pieceR * 2 / 5), 0, px + Math.floor(pieceR * 2 / 5), py - Math.floor(pieceR * 2 / 5), Math.ceil(pieceR / 2));
    gradient.addColorStop(0, piecemode === PieceMode.Black ? '#ccc' : '#fff');
    gradient.addColorStop(1, piecemode === PieceMode.Black ? '#000' : '#ccc');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(px, py, pieceR, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}

function AIPlay() {
    var maxScore = 0;
    var mx = -1, my = -1;
    var maxScoreMap = [];
    for (var i = 0; i < cellNum; i++) {
        scoreMap[i] = [];
        for (var j = 0; j < cellNum; j++) {
            scoreMap[i][j] = 0;
        }
    }
    // 遍历所有空位判断周围八个方向类型
    for (var i = 0; i < cellNum; i++) {
        for (var j = 0; j < cellNum; j++) {
            if (chessMap[i][j] == PieceMode.None && gameMode != GameMode.Noplay) {
                scoreMap[i][j] += WeightedCalculation(typesConvert(roundErgodic(i, j, PieceMode.Black), PieceMode.Black), PieceMode.Black);
                scoreMap[i][j] += WeightedCalculation(typesConvert(roundErgodic(i, j, PieceMode.White), PieceMode.White), PieceMode.White);
            }
        }
    }

    // 查找最大权重
    for (var i = 0; i < cellNum; i++) {
        for (var j = 0; j < cellNum; j++) {
            if (scoreMap[i][j] > maxScore) {
                maxScore = scoreMap[i][j];
            }
        }
    }

    // 寻找所有最大权重坐标
    for (var i = 0; i < cellNum; i++) {
        for (var j = 0; j < cellNum; j++) {
            if (scoreMap[i][j] == maxScore) {
                var maxScoreAddr = [];
                maxScoreAddr.push(i);
                maxScoreAddr.push(j);
                maxScoreMap.push(maxScoreAddr);
            }
        }
    }

    // 获取随机坐标
    var r = Math.floor(Math.random() * maxScoreMap.length);
    mx = maxScoreMap[r][0];
    my = maxScoreMap[r][1];

    // 放置棋子
    if (mx != -1 && my != -1) {
        chessMap[mx][my] = PieceMode.White;
        pieceDraw(mx, my, PieceMode.White);
        chessOrder[order][0] = mx;
        chessOrder[order][1] = my;
        order++;
    }

    chessPlaying();
}

function roundErgodic(x, y, pm) {
    var roundType = [0, 0, 0, 0, 0, 0, 0, 0];

    for (var m = 0; m < 8; m++) {
        if (roundType[m] == 0) {
            for (var n = 1; n <= lianzhuNum; n++) {
                var px = x + n * direction[m][0];
                var py = y + n * direction[m][1];

                if (px < cellNum && px >= 0 && py < cellNum && py >= 0) {
                    if (roundType[m] == SingleTypes.OXOXP) {
                        if (chessMap[px][py] != PieceMode.None)
                            roundType[m] = SingleTypes.OXP;
                        break;
                    }

                    if (roundType[m] == SingleTypes.OXP) {
                        if (chessMap[px][py] == pm) {
                            roundType[m] = SingleTypes.OXOXP;
                            continue;
                        }
                        break;
                    }

                    if (roundType[m] == SingleTypes.OP) {
                        if (chessMap[px][py] != pm && chessMap[px][py] != PieceMode.None)
                            roundType[m] = SingleTypes.WOOP;
                        break;
                    }

                    if (roundType[m] == SingleTypes.WXXXOP && chessMap[px][py] == PieceMode.None) {
                        roundType[m] = SingleTypes.OP;
                        break;
                    }
                    else if (chessMap[px][py] == PieceMode.None && n == 1) {
                        roundType[m] = SingleTypes.WOP;
                    }
                    else if (chessMap[px][py] == pm) {
                        roundType[m] += 2;
                    }
                    else if (chessMap[px][py] == PieceMode.None && roundType[m] >= SingleTypes.WOOP) {
                        roundType[m] += 1;
                        if (roundType[m] == SingleTypes.OP)
                            continue;
                        break;
                    }
                    else if (chessMap[px][py] == PieceMode.None && roundType[m] != 0 && roundType[m] < SingleTypes.WOOP) {
                        roundType[m] -= 1;
                        if (roundType[m] == SingleTypes.OXP)
                            continue;
                        break;
                    }
                    else
                        break;
                }
            }
        }
    }

    return roundType;
}

function typesConvert(types, pm) {
    var categorys = [];
    for (var i = 0; i < Object.keys(Categorys).length; i++) {
        categorys[i] = 0;
    }
    for (var i = 0; i < 4; i++) {
        /* 眠一：WXPO */
        // WXPO
        if ((types[i] == SingleTypes.WXP && types[i + 4] == SingleTypes.OP) || (types[i] == SingleTypes.OP && types[i + 4] == SingleTypes.WXP))
            categorys[Categorys.SleepOne] += 1;
        /* 活一：OXPM */
        // OXPM
        else if ((types[i] == SingleTypes.OXP && (types[i + 4] >= SingleTypes.WOOP && types[i + 4] <= SingleTypes.OP)) || ((types[i] >= SingleTypes.WOOP && types[i] <= SingleTypes.OP) && types[i + 4] == SingleTypes.OXP))
            categorys[Categorys.AliveOne] += 1;
        /* 眠二：WXPXO WPXXO WXXPO WXXPOOW WXXOPOW*/
        // WPXXO
        else if ((types[i] == SingleTypes.WP && types[i + 4] == SingleTypes.OXXP) || (types[i] == SingleTypes.OXXP && types[i + 4] == SingleTypes.WP))
            categorys[Categorys.SleepTwo] += 1;
        // WXPXO
        else if ((types[i] == SingleTypes.WXP && types[i + 4] == SingleTypes.OXP) || (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.WXP))
            categorys[Categorys.SleepTwo] += 1;
        // WXXPO
        else if ((types[i] == SingleTypes.WXXP && types[i + 4] == SingleTypes.OP) || (types[i] == SingleTypes.OP && types[i + 4] == SingleTypes.WXXP))
            categorys[Categorys.SleepTwo] += 1;
        // WXXPOOW
        else if ((types[i] == SingleTypes.WXXP && types[i + 4] == SingleTypes.WOOP) || (types[i] == SingleTypes.WOOP && types[i + 4] == SingleTypes.WXXP))
            categorys[Categorys.SleepTwo] += 1;
        // WXXOPOW
        else if ((types[i] == SingleTypes.WXXOP && types[i + 4] == SingleTypes.WOP) || (types[i] == SingleTypes.WOP && types[i + 4] == SingleTypes.WXXOP))
            categorys[Categorys.SleepTwo] += 1;
        /* 活二：OXXPM OXPXO */
        // OXPXO
        else if (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.OXP)
            categorys[Categorys.AliveTwo] += 1;
        // OXXPM
        else if ((types[i] == SingleTypes.OXXP && (types[i + 4] >= SingleTypes.WOOP && types[i + 4] <= SingleTypes.OP)) || ((types[i] >= SingleTypes.WOOP && types[i] <= SingleTypes.OP) && types[i + 4] == SingleTypes.OXXP))
            categorys[Categorys.AliveTwo] += 1;
        /* 跳二: OXOXPM */
        // OXOXPM
        else if ((types[i] == SingleTypes.OXOXP && (types[i + 4] >= SingleTypes.WOOP && types[i + 4] <= SingleTypes.OP)) || ((types[i] >= SingleTypes.WOOP && types[i] <= SingleTypes.OP) && types[i + 4] == SingleTypes.OXOXP))
            categorys[Categorys.JumpTwo] += 1;
        /* 中二：OXOPXO */
        // OXOPXO
        else if ((types[i] == SingleTypes.OXOP && types[i + 4] == SingleTypes.OXP) || (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.OXOP))
            categorys[Categorys.MiddleTwo] += 1;
        /* 边二：OXXOPM */
        // OXXOPO
        else if ((types[i] == SingleTypes.OXXOP && (types[i + 4] >= SingleTypes.WOOP && types[i + 4] <= SingleTypes.OP)) || ((types[i] >= SingleTypes.WOOP && types[i] <= SingleTypes.OP) && types[i + 4] == SingleTypes.OXXOP))
            categorys[Categorys.SideTwo] += 1;
        /* 眠三：WXXPXO WXPXXO WXXXPM WXXXOPW */
        // WXXPXO
        else if ((types[i] == SingleTypes.WXXP && types[i + 4] == SingleTypes.OXP) || (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.WXXP))
            categorys[Categorys.SleepThree] += 1;
        // WXPXXO
        else if ((types[i] == SingleTypes.WXP && types[i + 4] == SingleTypes.OXXP) || (types[i] == SingleTypes.OXXP && types[i + 4] == SingleTypes.WXP))
            categorys[Categorys.SleepThree] += 1;
        // WXXXPM
        else if ((types[i] == SingleTypes.WXXXP && (types[i + 4] >= SingleTypes.WOOP && types[i + 4] <= SingleTypes.OP)) || ((types[i] >= SingleTypes.WOOP && types[i] <= SingleTypes.OP) && types[i + 4] == SingleTypes.WXXXP))
            categorys[Categorys.SleepThree] += 1;
        // WXXXOPA
        else if (types[i] == SingleTypes.WXXXOP || types[i + 4] == SingleTypes.WXXXOP)
            categorys[Categorys.SleepThree] += 1;
        /* 活三：OXXXPM OXXPXO */
        // OXXPXO
        else if ((types[i] == SingleTypes.OXXP && types[i + 4] == SingleTypes.OXP) || (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.OXXP))
            categorys[Categorys.AliveThree] += 1;
        // OXXXPM
        else if ((types[i] == SingleTypes.OXXXP && (types[i + 4] >= SingleTypes.WOOP && types[i + 4] <= SingleTypes.OP)) || ((types[i] >= SingleTypes.WOOP && types[i] <= SingleTypes.OP) && types[i + 4] == SingleTypes.OXXXP))
            categorys[Categorys.AliveThree] += 1;
        /* 冲四：WXXXXPA WXXXPXO WXXPXXO WXXXPXW OXXPXXO OXXXPXO */
        // WXXXXPA
        else if (types[i] == SingleTypes.WXXXXP || types[i + 4] == SingleTypes.WXXXXP)
            categorys[Categorys.RushFour] += 1;
        // WXXPXXO
        else if ((types[i] == SingleTypes.WXXP && types[i + 4] == SingleTypes.OXXP) || (types[i] == SingleTypes.OXXP && types[i + 4] == SingleTypes.WXXP))
            categorys[Categorys.RushFour] += 1;
        // WXXXPXO
        else if ((types[i] == SingleTypes.WXXXP && types[i + 4] == SingleTypes.OXP) || (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.WXXXP))
            categorys[Categorys.RushFour] += 1;
        // OXXXPXW
        else if ((types[i] == SingleTypes.WXP && types[i + 4] == SingleTypes.OXXXP) || (types[i] == SingleTypes.OXXXP && types[i + 4] == SingleTypes.WXP))
            categorys[Categorys.RushFour] += 1;
        // WXXXPXW
        else if ((types[i] == SingleTypes.WXP && types[i + 4] == SingleTypes.WXXXP) || (types[i] == SingleTypes.WXXXP && types[i + 4] == SingleTypes.WXP))
            categorys[Categorys.RushFour] += 1;
        // OXXPXXO
        else if (types[i] == SingleTypes.OXXP && types[i + 4] == SingleTypes.OXXP)
            categorys[Categorys.RushFour] += 1;
        // OXXXPXO
        else if ((types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.OXXXP) || (types[i] == SingleTypes.OXXXP && types[i + 4] == SingleTypes.OXP))
            categorys[Categorys.RushFour] += 1;
        /* 长五：WXXPXXXO WXXPXXXW OXXPXXXW WXXXXPXO WXXXXPXW */
        // WXXPXXXO
        else if ((types[i] == SingleTypes.OXXXP && types[i + 4] == SingleTypes.WXXP) || (types[i] == SingleTypes.WXXP && types[i + 4] == SingleTypes.OXXXP))
            categorys[Categorys.LongFive] += 1;
        // WXXPXXXW
        else if ((types[i] == SingleTypes.WXXP && types[i + 4] == SingleTypes.WXXXP) || (types[i] == SingleTypes.WXXXP && types[i + 4] == SingleTypes.WXXP))
            categorys[Categorys.LongFive] += 1;
        // OXXPXXXW
        else if ((types[i] == SingleTypes.OXXP && types[i + 4] == SingleTypes.WXXXP) || (types[i] == SingleTypes.WXXXP && types[i + 4] == SingleTypes.OXXP))
            categorys[Categorys.LongFive] += 1;
        // WXXXXPXO
        else if ((types[i] == SingleTypes.WXXXXP && types[i + 4] == SingleTypes.OXP) || (types[i] == SingleTypes.OXP && types[i + 4] == SingleTypes.WXXXXP))
            categorys[Categorys.LongFive] += 1;
        // WXXXXPXW
        else if ((types[i] == SingleTypes.WXXXXP && types[i + 4] == SingleTypes.WXP) || (types[i] == SingleTypes.WXP && types[i + 4] == SingleTypes.WXXXXP))
            categorys[Categorys.LongFive] += 1;
        /* 活四：OXXXXPA */
        else if (types[i] == SingleTypes.OXXXXP || types[i + 4] == SingleTypes.OXXXXP)
            categorys[Categorys.AliveFour] += 1;
    }
    /* 三三 */
    if (categorys[Categorys.AliveTwo] + categorys[Categorys.JumpTwo] + categorys[Categorys.MiddleTwo] + categorys[Categorys.SideTwo] > 1)
        categorys[Categorys.ThreeThree] += 1;
    /* 四四 */
    else if (categorys[Categorys.SleepThree] > 1)
        categorys[Categorys.FourFour] += 1;
    /* 四三 */
    else if (categorys[Categorys.SleepThree] + categorys[Categorys.AliveTwo] + categorys[Categorys.JumpTwo] + categorys[Categorys.MiddleTwo] + categorys[Categorys.SideTwo] > 1)
        categorys[Categorys.FourThree] += 1;

    return categorys;
}

function WeightedCalculation(categorys, pm) {
    var weight = 0;

    if (pm == PieceMode.Black) {
        weight += categorys[Categorys.SleepOne] * 1;
        weight += categorys[Categorys.AliveOne] * 1;
        weight += categorys[Categorys.SleepTwo] * 1;
        weight += (categorys[Categorys.AliveTwo] + categorys[Categorys.JumpTwo] + categorys[Categorys.MiddleTwo] + categorys[Categorys.SideTwo]) * 5;
        weight += categorys[Categorys.SleepThree] * 10;
        weight += (categorys[Categorys.ThreeThree] + categorys[Categorys.FourFour] + categorys[Categorys.FourThree]) * 100;
        weight += categorys[Categorys.AliveThree] * 150;
        weight += categorys[Categorys.RushFour] * 500;
        weight += categorys[Categorys.LongFive] * 500;
        weight += categorys[Categorys.AliveFour] * 500;
    }
    else if (pm == PieceMode.White) {
        weight += categorys[Categorys.SleepOne] * 1;
        weight += categorys[Categorys.AliveOne] * 5;
        weight += categorys[Categorys.SleepTwo] * 10;
        weight += (categorys[Categorys.AliveTwo] + categorys[Categorys.JumpTwo] + categorys[Categorys.MiddleTwo] + categorys[Categorys.SideTwo]) * 15;
        weight += categorys[Categorys.SleepThree] * 160;
        weight += (categorys[Categorys.ThreeThree] + categorys[Categorys.FourFour] + categorys[Categorys.FourThree]) * 120;
        weight += categorys[Categorys.AliveThree] * 200;
        weight += categorys[Categorys.RushFour] * 1000;
        weight += categorys[Categorys.LongFive] * 1000;
        weight += categorys[Categorys.AliveFour] * 1000;
    }

    return weight;
}