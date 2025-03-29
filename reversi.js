/**
 * リバーシゲームのメインJavaScriptファイル
 * @file reversi.js
 */

// 即時実行関数で全体をラップし、グローバル名前空間を汚染しないようにする
(function() {
    'use strict';

    // 定数定義
    const EMPTY = 0;
    const BLACK = 1;
    const WHITE = 2;
    const BOARD_SIZE = 8;

    // 方向ベクトル（8方向）
    const DIRECTIONS = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1],  [1, 0],  [1, 1]
    ];

    // ゲーム状態
    let board = [];
    let currentPlayer = BLACK;
    let gameOver = false;
    let showValidMoves = false;
    let moveHistory = [];

    // DOM要素
    const gameBoard = document.getElementById('game-board');
    const blackScoreElement = document.getElementById('black-score');
    const whiteScoreElement = document.getElementById('white-score');
    const currentPlayerDiscElement = document.getElementById('current-player-disc');
    const gameStatusElement = document.getElementById('game-status');
    const movesListElement = document.getElementById('moves-list');
    const restartButton = document.getElementById('restart-btn');
    const showMovesButton = document.getElementById('show-moves-btn');

    /**
     * 座標を文字に変換（A1, B2など）
     * @param {number} row - 行インデックス
     * @param {number} col - 列インデックス
     * @return {string} 変換された座標表記
     */
    function coordToNotation(row, col) {
      return String.fromCharCode(65 + col) + (row + 1);
    }

    /**
     * ゲームを初期化する
     */
    function initGame() {
      // 盤面の初期化
      board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));

      // 初期配置
      board[3][3] = WHITE;
      board[3][4] = BLACK;
      board[4][3] = BLACK;
      board[4][4] = WHITE;

      currentPlayer = BLACK;
      gameOver = false;
      moveHistory = [];

      // 盤面の描画
      renderBoard();
      updateGameInfo();
      updateMoveHistory();
    }

    /**
     * 盤面を描画する
     */
    function renderBoard() {
      // ハイライト要素を保持するか、なければ作成する
      let highlight = gameBoard.querySelector('.board-highlight');
      if (!highlight) {
        highlight = document.createElement('div');
        highlight.className = 'board-highlight';
      }

      gameBoard.innerHTML = '';
      gameBoard.appendChild(highlight);

      // セルを作成
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          const cell = document.createElement('div');
          cell.className = 'cell';
          cell.dataset.row = row;
          cell.dataset.col = col;

          if (board[row][col] !== EMPTY) {
            const disc = document.createElement('div');
            disc.className = `cell-disc ${board[row][col] === BLACK ? 'black' : 'white'}`;
            cell.appendChild(disc);
          } else if (showValidMoves && isValidMove(row, col, currentPlayer)) {
            cell.classList.add('valid-move');
          }

          cell.addEventListener('click', () => handleCellClick(row, col));
          gameBoard.appendChild(cell);
        }
      }
    }

    /**
     * ゲーム情報を更新する
     */
    function updateGameInfo() {
      // スコアの計算
      const scores = calculateScores();
      const blackCount = scores.black;
      const whiteCount = scores.white;

      // スコア表示の更新
      blackScoreElement.textContent = blackCount;
      whiteScoreElement.textContent = whiteCount;

      // 現在のプレイヤー表示の更新
      currentPlayerDiscElement.className = `disc ${currentPlayer === BLACK ? 'black' : 'white'}`;

      // ゲーム状態の表示
      if (gameOver) {
        if (blackCount > whiteCount) {
          gameStatusElement.textContent = '黒の勝利！';
        } else if (whiteCount > blackCount) {
          gameStatusElement.textContent = '白の勝利！';
        } else {
          gameStatusElement.textContent = '引き分け！';
        }
      } else {
        const hasValidMove = checkValidMoves(currentPlayer);

        if (!hasValidMove) {
          const oppositePlayer = currentPlayer === BLACK ? WHITE : BLACK;
          const oppositeHasValidMove = checkValidMoves(oppositePlayer);

          if (oppositeHasValidMove) {
            gameStatusElement.textContent = `${currentPlayer === BLACK ? '黒' : '白'}の手番はパスです`;
            moveHistory.push({
              player: currentPlayer,
              notation: 'パス',
              blackCount,
              whiteCount
            });
            updateMoveHistory();
            currentPlayer = oppositePlayer;
            renderBoard();
          } else {
            gameOver = true;
            updateGameInfo();
          }
        } else {
          gameStatusElement.textContent = '';
        }
      }
    }

    /**
     * 黒と白の石の数を計算する
     * @return {Object} 黒と白の石の数を含むオブジェクト
     */
    function calculateScores() {
      let blackCount = 0;
      let whiteCount = 0;

      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (board[row][col] === BLACK) {
            blackCount++;
          } else if (board[row][col] === WHITE) {
            whiteCount++;
          }
        }
      }

      return { black: blackCount, white: whiteCount };
    }

    /**
     * 対局履歴を更新する
     */
    function updateMoveHistory() {
      movesListElement.innerHTML = '';

      moveHistory.forEach((move, index) => {
        const moveItem = document.createElement('div');
        moveItem.className = 'move-item';
        moveItem.textContent = `${index + 1}. ${move.player === BLACK ? '黒' : '白'} ${move.notation} (${move.blackCount}-${move.whiteCount})`;
        movesListElement.appendChild(moveItem);
      });

      // 自動スクロールを最下部に
      movesListElement.scrollTop = movesListElement.scrollHeight;
    }

    /**
     * セルクリックハンドラ
     * @param {number} row - クリックされた行
     * @param {number} col - クリックされた列
     */
    function handleCellClick(row, col) {
      if (gameOver || board[row][col] !== EMPTY) {
        return;
      }

      if (isValidMove(row, col, currentPlayer)) {
        // 反転する石を計算
        const flippedDiscs = getFlippedDiscs(row, col, currentPlayer);

        // 石を置く
        board[row][col] = currentPlayer;

        // アニメーション付きで石を反転
        setTimeout(() => {
          flippedDiscs.forEach(([r, c]) => {
            board[r][c] = currentPlayer;
            const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${c}"] .cell-disc`);
            if (cell) {
              cell.classList.add('flipping');
              setTimeout(() => {
                cell.className = `cell-disc ${currentPlayer === BLACK ? 'black' : 'white'}`;
              }, 200);
              setTimeout(() => {
                cell.classList.remove('flipping');
              }, 400);
            }
          });

          // 手番を計算用に保存
          const movePlayerColor = currentPlayer;

          // 手番を交代
          currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;

          // 盤面の再描画
          renderBoard();

          // ゲーム情報の更新
          updateGameInfo();

          // 対局履歴に追加
          const scores = calculateScores();
          moveHistory.push({
            player: movePlayerColor,
            notation: coordToNotation(row, col),
            blackCount: scores.black,
            whiteCount: scores.white
          });
          updateMoveHistory();
        }, 10);
      }
    }

    /**
     * 有効な手かチェックする
     * @param {number} row - チェックする行
     * @param {number} col - チェックする列
     * @param {number} player - プレイヤー (BLACK または WHITE)
     * @return {boolean} 有効な手かどうか
     */
    function isValidMove(row, col, player) {
      if (board[row][col] !== EMPTY) {
        return false;
      }

      return getFlippedDiscs(row, col, player).length > 0;
    }

    /**
     * 反転する石を取得する
     * @param {number} row - 置く行
     * @param {number} col - 置く列
     * @param {number} player - プレイヤー (BLACK または WHITE)
     * @return {Array} 反転する石の座標配列
     */
    function getFlippedDiscs(row, col, player) {
      const opponent = player === BLACK ? WHITE : BLACK;
      let flippedDiscs = [];

      // 8方向をチェック
      for (const [dx, dy] of DIRECTIONS) {
        let r = row + dx;
        let c = col + dy;
        let tempFlipped = [];

        // その方向に相手の石があるか
        while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === opponent) {
          tempFlipped.push([r, c]);
          r += dx;
          c += dy;
        }

        // その方向の最後に自分の石があるか
        if (tempFlipped.length > 0 && r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE && board[r][c] === player) {
          flippedDiscs = flippedDiscs.concat(tempFlipped);
        }
      }

      return flippedDiscs;
    }

    /**
     * 指定されたプレイヤーに有効な手があるかチェックする
     * @param {number} player - プレイヤー (BLACK または WHITE)
     * @return {boolean} 有効な手があるかどうか
     */
    function checkValidMoves(player) {
      for (let row = 0; row < BOARD_SIZE; row++) {
        for (let col = 0; col < BOARD_SIZE; col++) {
          if (isValidMove(row, col, player)) {
            return true;
          }
        }
      }
      return false;
    }

    // イベントリスナーの設定
    restartButton.addEventListener('click', initGame);

    showMovesButton.addEventListener('click', () => {
      showValidMoves = !showValidMoves;
      renderBoard();
    });

    // ゲーム開始
    initGame();
  })();
