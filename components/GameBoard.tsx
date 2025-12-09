import React from 'react';
import { Coordinate, GameStatus } from '../types';
import { GRID_SIZE } from '../constants';
import { Play, RotateCcw } from 'lucide-react';

interface GameBoardProps {
  snake: Coordinate[];
  food: Coordinate;
  status: GameStatus;
  startGame: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ snake, food, status, startGame }) => {
  // Create an array for grid cells
  const gridCells = Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, i) => i);

  // Helper to determine cell type
  const getCellClass = (index: number) => {
    const x = index % GRID_SIZE;
    const y = Math.floor(index / GRID_SIZE);

    const isFood = food.x === x && food.y === y;
    const snakeIndex = snake.findIndex((s) => s.x === x && s.y === y);
    const isHead = snakeIndex === 0;
    const isBody = snakeIndex > 0;

    if (isHead) return 'bg-emerald-400 rounded-sm z-10 scale-110 shadow-[0_0_10px_rgba(52,211,153,0.5)]';
    if (isBody) return 'bg-emerald-600/80 rounded-sm';
    if (isFood) return 'bg-rose-500 rounded-full animate-pulse shadow-[0_0_15px_rgba(244,63,94,0.6)] scale-75';

    // Grid pattern effect
    return (x + y) % 2 === 0 ? 'bg-gray-800/50' : 'bg-gray-800/30';
  };

  return (
    <div className="relative">
      <div
        className="grid gap-px bg-gray-900 border-4 border-gray-700 rounded-lg shadow-2xl overflow-hidden"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: 'min(90vw, 500px)',
          height: 'min(90vw, 500px)',
        }}
      >
        {gridCells.map((i) => (
          <div key={i} className={`w-full h-full transition-all duration-100 ${getCellClass(i)}`} />
        ))}
      </div>

      {/* Overlay for Game Over / Idle */}
      {(status === GameStatus.GAME_OVER || status === GameStatus.IDLE) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm rounded-lg z-20">
          <h2 className="text-4xl font-extrabold text-white mb-4 drop-shadow-lg tracking-wider">
            {status === GameStatus.IDLE ? 'SNAKE' : 'GAME OVER'}
          </h2>
          <button
            onClick={startGame}
            className="group relative flex items-center gap-3 px-8 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
          >
            {status === GameStatus.IDLE ? <Play className="w-6 h-6 fill-current" /> : <RotateCcw className="w-6 h-6" />}
            <span>{status === GameStatus.IDLE ? 'JOGAR' : 'REINICIAR'}</span>
          </button>
        </div>
      )}
      
      {status === GameStatus.PAUSED && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] rounded-lg z-20">
          <div className="bg-gray-800 px-6 py-3 rounded-xl border border-gray-600 shadow-xl">
             <span className="text-2xl font-bold text-white tracking-widest">PAUSADO</span>
          </div>
        </div>
      )}
    </div>
  );
};
