"use client";

import React, { useState } from 'react';
import { Card } from '@/lib/gameUtils';

interface MemoryCardProps {
  card: Card | null; // null for empty spaces
  onClick: () => void;
  isDisabled: boolean;
  gridPosition: number;
}

export default function MemoryCard({
  card,
  onClick,
  isDisabled
}: MemoryCardProps) {
  const [isFlipping, setIsFlipping] = useState(false);

  const handleClick = () => {
    if (!card || isDisabled || isFlipping) return;
    
    if (!card.isFlipped && !card.isMatched && !card.isCollected) {
      setIsFlipping(true);
      
      // Start flip animation, then call onClick
      setTimeout(() => {
        onClick();
        setIsFlipping(false);
      }, 300); // Half of the flip animation duration
    }
  };

  // If card is null (empty space), render empty div
  if (!card || card.isCollected) {
    return (
      <div className="relative w-full aspect-square">
        {/* Empty space where collected card used to be */}
      </div>
    );
  }

  const isFlipped = card.isFlipped || card.isMatched || isFlipping;

  return (
    <div 
      className="relative w-full aspect-square cursor-pointer select-none"
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-600 ease-in-out ${
          isFlipped ? 'rotate-y-180' : 'rotate-y-0'
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: card.isCollecting 
            ? `rotateY(180deg) rotateZ(720deg) scale(0.6) translateY(200px)` 
            : isFlipped 
            ? 'rotateY(180deg)' 
            : 'rotateY(0deg)'
        }}
      >
        {/* Card Back (Hidden State) */}
        <div 
          className="absolute inset-0 w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 rounded-lg md:rounded-xl shadow-lg flex items-center justify-center border-2 border-white/20 hover:from-purple-400 hover:via-blue-400 hover:to-indigo-400 transition-all duration-200"
          style={{
            backfaceVisibility: 'hidden'
          }}
        >
          <div className="text-white/80 text-3xl md:text-4xl font-bold">
            ?
          </div>
        </div>

        {/* Card Front (Emoji State) */}
        <div 
          className={`absolute inset-0 w-full h-full rounded-lg md:rounded-xl shadow-lg flex items-center justify-center border-2 transition-all duration-300 ${
            card.isMatched ? 'bg-green-50 border-green-300' : 'bg-white border-gray-300'
          }`}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div 
            className="text-4xl md:text-5xl lg:text-6xl transform transition-transform hover:scale-110"
            role="img"
            aria-label={`Card with ${card.emoji} emoji`}
          >
            {card.emoji}
          </div>
        </div>
      </div>

      {/* Collection Animation Effect */}
      {card.isCollecting && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            animation: 'spin-collect 1s ease-out forwards'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 rounded-lg md:rounded-xl opacity-60 animate-pulse" />
        </div>
      )}
    </div>
  );
}