import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Pause, Play } from 'lucide-react';
import { Direction, GameStatus } from '../types';

interface ControlsProps {
  onDirectionChange: (dir: Direction) => void;
  onPauseToggle: () => void;
  status: GameStatus;
}

export const Controls: React.FC<ControlsProps> = ({ onDirectionChange, onPauseToggle, status }) => {
  return (
    <div className="mt-6 flex flex-col items-center gap-6 w-full max-w-[500px]">
      
      {/* Mobile D-Pad */}
      <div className="grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button
          className="bg-gray-700/80 active:bg-emerald-500 p-4 rounded-xl shadow-lg transition-colors border-b-4 border-gray-900 active:border-emerald-700 active:translate-y-1"
          onClick={() => onDirectionChange(Direction.UP)}
          aria-label="Cima"
        >
          <ArrowUp className="w-8 h-8 text-white" />
        </button>
        <div />
        
        <button
          className="bg-gray-700/80 active:bg-emerald-500 p-4 rounded-xl shadow-lg transition-colors border-b-4 border-gray-900 active:border-emerald-700 active:translate-y-1"
          onClick={() => onDirectionChange(Direction.LEFT)}
          aria-label="Esquerda"
        >
          <ArrowLeft className="w-8 h-8 text-white" />
        </button>
        
        <button
           className="bg-gray-700/80 active:bg-yellow-500 p-4 rounded-xl shadow-lg transition-colors border-b-4 border-gray-900 active:border-yellow-700 active:translate-y-1 flex items-center justify-center"
           onClick={onPauseToggle}
           aria-label={status === GameStatus.PAUSED ? "Continuar" : "Pausar"}
        >
            {status === GameStatus.PAUSED ? <Play className="w-6 h-6 fill-white"/> : <Pause className="w-6 h-6 fill-white"/>}
        </button>

        <button
          className="bg-gray-700/80 active:bg-emerald-500 p-4 rounded-xl shadow-lg transition-colors border-b-4 border-gray-900 active:border-emerald-700 active:translate-y-1"
          onClick={() => onDirectionChange(Direction.RIGHT)}
          aria-label="Direita"
        >
          <ArrowRight className="w-8 h-8 text-white" />
        </button>
        
        <div />
        <button
          className="bg-gray-700/80 active:bg-emerald-500 p-4 rounded-xl shadow-lg transition-colors border-b-4 border-gray-900 active:border-emerald-700 active:translate-y-1"
          onClick={() => onDirectionChange(Direction.DOWN)}
          aria-label="Baixo"
        >
          <ArrowDown className="w-8 h-8 text-white" />
        </button>
        <div />
      </div>

      {/* Desktop Hints */}
      <div className="hidden md:flex flex-col items-center text-gray-400 text-sm gap-2 bg-gray-800/50 p-4 rounded-lg w-full">
        <div className="flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-gray-200 font-mono text-xs border border-gray-600">SETAS</span>
            <span>ou</span>
            <span className="bg-gray-700 px-2 py-1 rounded text-gray-200 font-mono text-xs border border-gray-600">WASD</span>
            <span>para mover</span>
        </div>
        <div className="flex items-center gap-2">
            <span className="bg-gray-700 px-2 py-1 rounded text-gray-200 font-mono text-xs border border-gray-600">ESPAÇO</span>
            <span>para pausar</span>
        </div>
      </div>
    </div>
  );
};
