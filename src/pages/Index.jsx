import React, { useState } from "react";
import { Box, Button, Circle, Flex, Grid, Heading, Text, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

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

  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex direction="column" align="center" bg="green.800" minH="100vh" py={8}>
      <Heading mb={8} color="white">
        Othello
      </Heading>

      <Box borderRadius="md" overflow="hidden" boxShadow="xl">
        <Box bg="url(wood-texture.jpg) center/cover" p={4}>
          <Grid gridTemplateColumns={`repeat(${BOARD_SIZE}, 1fr)`} gap={2}>
            {board.map((row, rowIndex) => row.map((cell, colIndex) => <Circle key={`${rowIndex}-${colIndex}`} size="60px" bg={cell === GREEN ? "linear-gradient(green 50%, white 50%)" : cell === WHITE ? "linear-gradient(white 50%, green 50%)" : "gray.200"} onClick={() => placePiece(rowIndex, colIndex)} cursor="pointer" boxShadow="inner 0 -2px 2px rgba(0,0,0,0.2)" borderWidth={cell ? "4px" : "2px"} borderStyle="solid" borderColor={cell === GREEN ? "green.600" : cell === WHITE ? "gray.300" : "gray.400"} transition="all 0.5s" transform={cell && "rotateX(360deg)"} />))}
          </Grid>
        </Box>
      </Box>

      <Flex mt={8} align="center">
        <Box mr={8}>
          <Heading size="lg" mb={4} color="white">
            Scores
          </Heading>
          <Flex>
            <Text fontSize="2xl" mr={4} color="green.300">
              Green: {scores[GREEN]}
            </Text>
            <Text fontSize="2xl" color="gray.100">
              White: {scores[WHITE]}
            </Text>
          </Flex>
        </Box>
        <Button colorScheme="gray" onClick={onOpen}>
          How to Play
        </Button>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>How to Play Othello</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text mb={4}>Othello is a strategy board game for two players. The goal is to have the majority of discs on the board at the end of the game.</Text>
            <Text mb={4}>Players take turns placing discs on the board with their assigned color facing up. A player must place a disc in a position that "outflanks" one or more of the opponent's discs.</Text>
            <Text>A disc or row of discs is outflanked when it is surrounded at the ends by discs of the opposite color. Discs may be outflanked along a row, column, or diagonal. All of the opponent's discs that are outflanked will be flipped to the current player's color.</Text>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Box mt={8}>
        {gameOver && (
          <Box mb={4}>
            <Text fontSize="3xl" fontWeight="bold" color="white">
              Game Over! {scores[GREEN] > scores[WHITE] ? "Green" : "White"} wins!
            </Text>
          </Box>
        )}
        <Button
          colorScheme="green"
          size="lg"
          onClick={() => {
            setBoard(initializeBoard());
            setCurrentPlayer(GREEN);
            setScores({ [GREEN]: 2, [WHITE]: 2 });
            setGameOver(false);
          }}
        >
          {gameOver ? "Play Again" : "Restart Game"}
        </Button>
      </Box>
    </Flex>
  );
};

export default Index;
