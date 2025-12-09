import React, { useEffect } from 'react';
import { useSnakeGame } from './hooks/useSnakeGame';
import { GameBoard } from './components/GameBoard';
import { Controls } from './components/Controls';
import { Direction, GameStatus } from './types';
import { Trophy, Zap } from 'lucide-react';

export default function App() {
  const {
    snake,
    food,
    status,
    score,
    highScore,
    startGame,
    pauseGame,
    changeDirection,
  } = useSnakeGame();

  // Keyboard Event Listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling for arrow keys and space
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          changeDirection(Direction.UP);
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          changeDirection(Direction.DOWN);
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          changeDirection(Direction.LEFT);
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          changeDirection(Direction.RIGHT);
          break;
        case ' ':
        case 'Enter':
          if (status === GameStatus.GAME_OVER || status === GameStatus.IDLE) {
             startGame();
          } else {
             pauseGame();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [changeDirection, pauseGame, startGame, status]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 select-none touch-none">
      
      {/* Header */}
      <div className="w-full max-w-[500px] flex justify-between items-end mb-6">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 italic tracking-tighter">
            SNAKE PRO
          </h1>
          <p className="text-gray-500 text-xs font-medium">Clássico Retro Remasterizado</p>
        </div>

        <div className="flex gap-4">
            <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Melhor</p>
                <div className="flex items-center justify-end gap-1.5 text-yellow-500">
                    <Trophy size={16} />
                    <span className="text-xl font-bold font-mono">{highScore}</span>
                </div>
            </div>
            
            <div className="text-right">
                <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mb-1">Pontos</p>
                <div className="flex items-center justify-end gap-1.5 text-emerald-400">
                    <Zap size={16} />
                    <span className="text-xl font-bold font-mono">{score}</span>
                </div>
            </div>
        </div>
      </div>

      {/* Game Area */}
      <GameBoard
        snake={snake}
        food={food}
        status={status}
        startGame={startGame}
      />

      {/* Controls */}
      <Controls
        onDirectionChange={changeDirection}
        onPauseToggle={pauseGame}
        status={status}
      />

    </div>
  );
}
