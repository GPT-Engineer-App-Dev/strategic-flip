# strategic-flip

Please implement a basic Othello game with the following features:

- An 8x8 game board, using green and white circles to represent the pieces
- Ability for two human players to take turns placing their pieces on the board by clicking 
- Enforce the rules of Othello:
  - A piece played must flank one or more of the opponent's pieces in any direction (horizontally, vertically or diagonally)
  - Any of the opponent's pieces flanked by the new piece are flipped to the current player's color
  - If a player cannot make a valid move, they must pass their turn
- Display the current scores for each player
- Detect when the game is over (no more valid moves) and display the winner

You can use a simple UI for now, the important part is getting the game logic working. We can improve the appearance later.

## Collaborate with GPT Engineer

This is a [gptengineer.app](https://gptengineer.app)-synced repository 🌟🤖

Changes made via gptengineer.app will be committed to this repo.

If you clone this repo and push changes, you will have them reflected in the GPT Engineer UI.

## Tech stack

This project is built with REPLACE_WITH_TECH_STACK_SUMMARY.

REPLACE_WITH_TECH_STACK_POINTS

## Setup

```sh
git clone https://github.com/GPT-Engineer-App-Dev/strategic-flip.git
cd strategic-flip
npm i
```

```sh
npm run dev
```

This will run a dev server with auto reloading and an instant preview.

## Requirements

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
