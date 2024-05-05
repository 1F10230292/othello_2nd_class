import styles from './index.module.css';
import { useEffect, useState } from 'react';

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
  const suggestPosition = (board: number[][], turnColor: number) => {
    const newboard = board.map((row) => [...row]);
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        //候補地には何も置かれていない
        if (board[y][x] === 0) {
          for (const direction of directions) {
            if (
              //候補地に面している隣の八方向が場外でないかつ、相手の色である
              board[y + direction[0]] !== undefined &&
              board[y + direction[0]][x + direction[1]] === 3 - turnColor
            ) {
              for (let i = 1; i < 8; i++) {
                //候補地から八方向全てのマス0~7番目までが場外でないかつ、相手の色である
                if (board[y + direction[0] * i] !== undefined) {
                  if (board[y + direction[0] * i][x + direction[1] * i] === 3 - turnColor) {
                    continue;
                  } else if (board[y + direction[0] * i][x + direction[1] * i] === turnColor) {
                    newboard[y][x] = 9;
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
      }
    }
    return newboard;
  };

  // 状態に保存されたボードを反映した上で、ユーザに示す用
  const [displayBoard, setDisplayBoard] = useState(suggestPosition(board, turnColor));

  // turnColorまたはboardが変更されたときに更新
  useEffect(() => {
    setDisplayBoard(suggestPosition(board, turnColor));
  }, [board, turnColor]);
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
        {displayBoard.map((row, y) =>
          row.map((color, x) => (
            <div className={styles.cellStyle} key={`${x}-${y}`} onClick={() => clickHandler(x, y)}>
              {color === 9 ? <div className={styles.suggestStyle} /> : null}
              {color !== 0 && color !== 9 && (
                <div
                  className={styles.stoneStyle}
                  style={{ background: color === 1 ? '#000' : '#fff' }}
                />
              )}
            </div>
          )),
        )}

        <div className={styles.myTurn}>
          <div className={styles.myTurnDisplay}>Turn:{blackOrWhite}</div>
          <div className={styles.turnColorDisplay}>
            <div className={styles.blackCount}> Black: {blackNum} point</div>
            <div className={styles.whiteCount}>White: {whiteNum} point</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
