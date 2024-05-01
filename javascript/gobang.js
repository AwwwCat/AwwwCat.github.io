const canvasContainer = document.getElementById("gobang");
const canvas = document.createElement("canvas");

const cWidth = canvasContainer.clientWidth;
const cHeight = canvasContainer.clientHeight;
const cellNum = 15;
const lianzhuNum = 5;
const direction = [[0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1], [-1, 0], [-1, 1]];
const PieceMode = { None: 0, Black: 1, White: 2 };
var chessMap = [];
var chessOrder = [];
var startX = 0, startY = 0;
var cellSize = 50;
var pieceR = 22;
var order = 0;
var pieceMode = 0;

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

        pieceX = (pieceX >= 0 && pieceX <= cellNum && pieceDistance <= pieceR) ? pieceX : -1;
        pieceY = (pieceY >= 0 && pieceY <= cellNum && pieceDistance <= pieceR) ? pieceY : -1;

        if (pieceX != -1 && pieceY != -1 && chessMap[pieceX][pieceY] == PieceMode.None) {
            chessMap[pieceX][pieceY] = pieceMode;
            chessOrder[order][0] = pieceX;
            chessOrder[order][1] = pieceY;
            order++;
            pieceDraw(startX + pieceX * cellSize, startY + pieceY * cellSize, pieceMode);
            lianziJudgment();
            pieceMode = pieceMode === PieceMode.Black ? PieceMode.White : PieceMode.Black;

        }
    }
    )
}

function lianziJudgment() {
    if (order == 0)
        return false;

    var directLine = [0, 0, 0, 0];

    for (var i = 0; i < 8; i++) {
        for (var j = 1; j < lianzhuNum; j++) {
            var px = chessOrder[order - 1][0] + j * direction[i][0];
            var py = chessOrder[order - 1][1] + j * direction[i][1];

            if (px <= cellNum && px >= 0 && py <= cellNum && py >= 0) {
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
    const gradient = context.createRadialGradient(px + Math.floor(pieceR * 2 / 5), py - Math.floor(pieceR * 2 / 5), 0, px + Math.floor(pieceR * 2 / 5), py - Math.floor(pieceR * 2 / 5), Math.ceil(pieceR / 2));
    gradient.addColorStop(0, piecemode === PieceMode.Black ? '#ccc' : '#fff');
    gradient.addColorStop(1, piecemode === PieceMode.Black ? '#000' : '#ddd');
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(px, py, pieceR, 0, 2 * Math.PI);
    context.fill();
    context.closePath();
}