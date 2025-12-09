import { useState, useCallback, useEffect, useRef } from 'react';
import { Coordinate, Direction, GameStatus } from '../types';
import { GRID_SIZE, INITIAL_SNAKE, INITIAL_SPEED, MIN_SPEED, SPEED_DECREMENT } from '../constants';
import { useInterval } from './useInterval';

// Helper to generate random food position not on snake
const generateFood = (snake: Coordinate[]): Coordinate => {
  let newFood: Coordinate;
  let isOnSnake = true;

  while (isOnSnake) {
    newFood = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
    // eslint-disable-next-line no-loop-func
    isOnSnake = snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y);
  }
  return newFood!;
};

export const useSnakeGame = () => {
  const [snake, setSnake] = useState<Coordinate[]>(INITIAL_SNAKE);
  const [food, setFood] = useState<Coordinate>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>(Direction.UP);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // We use a ref for the *next* direction to handle rapid key presses within one tick
  const nextDirection = useRef<Direction>(Direction.UP);

  // Load high score from local storage
  useEffect(() => {
    const stored = localStorage.getItem('snakeHighScore');
    if (stored) {
      setHighScore(parseInt(stored, 10));
    }
    // Initialize food
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  // Update high score when game ends or score exceeds it
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('snakeHighScore', score.toString());
    }
  }, [score, highScore]);

  const startGame = useCallback(() => {
    setSnake(INITIAL_SNAKE);
    setDirection(Direction.UP);
    nextDirection.current = Direction.UP;
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setStatus(GameStatus.PLAYING);
    setFood(generateFood(INITIAL_SNAKE));
  }, []);

  const pauseGame = useCallback(() => {
    if (status === GameStatus.PLAYING) setStatus(GameStatus.PAUSED);
    else if (status === GameStatus.PAUSED) setStatus(GameStatus.PLAYING);
  }, [status]);

  const changeDirection = useCallback((newDir: Direction) => {
    // Prevent reversing direction directly
    const currentDir = nextDirection.current; // Use ref to check against latest queued move
    
    if (newDir === Direction.UP && currentDir === Direction.DOWN) return;
    if (newDir === Direction.DOWN && currentDir === Direction.UP) return;
    if (newDir === Direction.LEFT && currentDir === Direction.RIGHT) return;
    if (newDir === Direction.RIGHT && currentDir === Direction.LEFT) return;

    nextDirection.current = newDir;
    // We update state for UI responsiveness immediately, 
    // but the logic mainly relies on nextDirection.current for the next tick
    setDirection(newDir);
  }, []);

  const gameLoop = useCallback(() => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      // Move head based on buffered direction
      switch (nextDirection.current) {
        case Direction.UP:
          newHead.y -= 1;
          break;
        case Direction.DOWN:
          newHead.y += 1;
          break;
        case Direction.LEFT:
          newHead.x -= 1;
          break;
        case Direction.RIGHT:
          newHead.x += 1;
          break;
      }

      // 1. Check Wall Collision
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE
      ) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      // 2. Check Self Collision
      // We don't check the very last tail segment because it will move forward anyway
      if (prevSnake.some((segment, index) => index !== prevSnake.length - 1 && segment.x === newHead.x && segment.y === newHead.y)) {
        setStatus(GameStatus.GAME_OVER);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // 3. Check Food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setSpeed((s) => Math.max(MIN_SPEED, s - SPEED_DECREMENT));
        setFood(generateFood(newSnake));
        // Don't pop the tail, so it grows
      } else {
        newSnake.pop(); // Remove tail to maintain size
      }

      return newSnake;
    });
  }, [food, status]);

  useInterval(
    gameLoop,
    status === GameStatus.PLAYING ? speed : null
  );

  return {
    snake,
    food,
    direction,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  };
};
