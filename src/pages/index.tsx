import styles from './index.module.css';
import { useState } from 'react';
const suggestPosition = (x: number, y: number, board: number[][], turnColor: number) => {
  console.log(x, y);
  const preSuggest: number[][] = [];
  for (const direction of directions) {
    if (board[y][x] === 0) {
      if (
        board[y + direction[0]] !== undefined &&
        board[y + direction[0]][x + direction[1]] === 3 - turnColor
      ) {
        for (let i = 1; i < 8; i++) {
          if (board[y + direction[0] * i] !== undefined) {
            if (board[y + direction[0] * i][x + direction[1] * i] === 3 - turnColor) {
              continue;
            } else if (board[y + direction[0] * i][x + direction[1] * i] === turnColor) {
              preSuggest[y][x] = turnColor;

              break;
            } else {
              // 盤面が0の時、要は何もない時
              break;
            }
          }
        }
        console.log('置ける候補は:', preSuggest);
      }
    }
  }
};
console.log(suggestPosition);
const directions = [
  [-1, 0],
  [-1, 1],
  [0, 1],
  [-1, -1],
  [1, 1],
  [1, 0],
  [1, -1],
  [0, -1],
];
const changeColorBoard: number[][] = [];
const Home = () => {
  const [turnColor, setTurnColor] = useState(1);
  const [board, setBoard] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 1, 0, 0, 0],
    [0, 0, 0, 1, 2, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const clickHandler = (x: number, y: number) => {
    // console.log(x, y);
    const newBoard = structuredClone(board);
    changeColorBoard.length = 0;
    for (const direction of directions) {
      const getPreBoard = [];
      if (board[y][x] === 0) {
        if (
          board[y + direction[0]] !== undefined &&
          board[y + direction[0]][x + direction[1]] === 3 - turnColor
        ) {
          for (let i = 1; i < 8; i++) {
            if (board[y + direction[0] * i] !== undefined) {
              if (board[y + direction[0] * i][x + direction[1] * i] === 3 - turnColor) {
                getPreBoard.push([y + direction[0] * i, x + direction[1] * i]);
                continue;
              } else if (board[y + direction[0] * i][x + direction[1] * i] === turnColor) {
                newBoard[y][x] = turnColor;
                setTurnColor(3 - turnColor);
                for (const k of getPreBoard) {
                  changeColorBoard.push(k);
                }
                for (const j of changeColorBoard) {
                  newBoard[j[0]][j[1]] = turnColor;
                }

                setBoard(newBoard);
                // console.log(changeColorBoard);

                break;
              } else {
                // 盤面が0の時、要は何もない時
                break;
              }
            }
          }
        }
      }
    }
  };

  // ボード上の黒い石の数をカウントする関数
  const colorNum = board.flat();

  const blackNum = colorNum.filter((color) => color === 1).length;
  // console.log(blackNum);
  const whiteNum = colorNum.filter((color) => color === 2).length;
  // console.log(whiteNum);

  let blackOrWhite = '';
  if (turnColor !== 0) {
    if (turnColor === 1) {
      blackOrWhite = 'Black';
    }
    //turnColor === 2;
    else {
      blackOrWhite = 'White';
    }
  }
  return (
    <div className={styles.container}>
      <div className={styles.boardStyle}>
        {board.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color !== 0 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
              <div className={styles.suggestStyle}>{suggestPosition}</div>
            </div>
          )),
        )}
      </div>
      <div className={styles.myTurn}>
        <div className={styles.myTurnDisplay}>Turn:{blackOrWhite}</div>
        <div className={styles.turnColorDisplay}>
          <div className={styles.blackCount}> Black: {blackNum} point</div>
          <div className={styles.whiteCount}>White: {whiteNum} point</div>
        </div>
      </div>
    </div>
  );
};
export default Home;
