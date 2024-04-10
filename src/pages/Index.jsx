import React, { useState } from "react";
import { Box, Button, Circle, Flex, Grid, Heading, Text } from "@chakra-ui/react";

const BOARD_SIZE = 8;
const EMPTY = null;
const WHITE = "white";
const GREEN = "green";

const Index = () => {
  const [board, setBoard] = useState(initializeBoard());
  const [currentPlayer, setCurrentPlayer] = useState(GREEN);
  const [scores, setScores] = useState({ [GREEN]: 2, [WHITE]: 2 });
  const [gameOver, setGameOver] = useState(false);

  function initializeBoard() {
    const board = Array(BOARD_SIZE)
      .fill()
      .map(() => Array(BOARD_SIZE).fill(EMPTY));
    board[3][3] = WHITE;
    board[3][4] = GREEN;
    board[4][3] = GREEN;
    board[4][4] = WHITE;
    return board;
  }

  function isValidMove(row, col, player, currentBoard) {
    if (currentBoard[row][col] !== EMPTY) return false;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let [dx, dy] of directions) {
      let newRow = row + dx;
      let newCol = col + dy;
      let flipped = false;

      while (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        if (currentBoard[newRow][newCol] === EMPTY) break;
        if (currentBoard[newRow][newCol] === player) {
          if (flipped) return true;
          break;
        }
        flipped = true;
        newRow += dx;
        newCol += dy;
      }
    }
    return false;
  }

  function flipPieces(row, col, player, currentBoard) {
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[row][col] = player;

    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];
    for (let [dx, dy] of directions) {
      let newRow = row + dx;
      let newCol = col + dy;
      const flipped = [];

      while (newRow >= 0 && newRow < BOARD_SIZE && newCol >= 0 && newCol < BOARD_SIZE) {
        if (newBoard[newRow][newCol] === EMPTY) break;
        if (newBoard[newRow][newCol] === player) {
          for (let [r, c] of flipped) {
            newBoard[r][c] = player;
          }
          break;
        }
        flipped.push([newRow, newCol]);
        newRow += dx;
        newCol += dy;
      }
    }
    return newBoard;
  }

  function placePiece(row, col) {
    if (gameOver || !isValidMove(row, col, currentPlayer, board)) return;

    const newBoard = flipPieces(row, col, currentPlayer, board);
    const newScores = { ...scores };
    newBoard.forEach((row) =>
      row.forEach((cell) => {
        if (cell === GREEN) newScores[GREEN]++;
        if (cell === WHITE) newScores[WHITE]++;
      }),
    );

    setBoard(newBoard);
    setScores(newScores);
    setCurrentPlayer(currentPlayer === GREEN ? WHITE : GREEN);
    checkGameOver(newBoard);
  }

  function checkGameOver(currentBoard) {
    let hasValidMove = false;
    for (let row = 0; row < BOARD_SIZE; row++) {
      for (let col = 0; col < BOARD_SIZE; col++) {
        if (isValidMove(row, col, WHITE, currentBoard) || isValidMove(row, col, GREEN, currentBoard)) {
          hasValidMove = true;
          break;
        }
      }
      if (hasValidMove) break;
    }
    if (!hasValidMove) setGameOver(true);
  }

  return (
    <Flex direction="column" align="center">
      <Heading mb={4}>Othello</Heading>
      <Flex mb={4}>
        <Text mr={4}>Green: {scores[GREEN]}</Text>
        <Text>White: {scores[WHITE]}</Text>
      </Flex>
      <Grid gridTemplateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={1}>
        {board.map((row, rowIndex) => row.map((cell, colIndex) => <Circle key={`${rowIndex}-${colIndex}`} size="40px" bg={cell ?? "gray.200"} onClick={() => placePiece(rowIndex, colIndex)} cursor="pointer" />))}
      </Grid>
      {gameOver && (
        <Box mt={4}>
          <Text fontSize="xl" fontWeight="bold">
            Game Over! {scores[GREEN] > scores[WHITE] ? "Green" : "White"} wins!
          </Text>
          <Button
            mt={4}
            onClick={() => {
              setBoard(initializeBoard());
              setCurrentPlayer(GREEN);
              setScores({ [GREEN]: 2, [WHITE]: 2 });
              setGameOver(false);
            }}
          >
            Restart Game
          </Button>
        </Box>
      )}
    </Flex>
  );
};

export default Index;
