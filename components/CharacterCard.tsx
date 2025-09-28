import React from 'react';
import type { Character } from '../types';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg p-6 transform hover:scale-105 transition-transform duration-300">
      <div className="flex items-center mb-3">
        <span className={`w-3 h-3 rounded-full mr-3 ${character.colors}`}></span>
        <h3 className="text-2xl font-bold text-white">{character.name}</h3>
      </div>
      <p className="text-sm font-semibold text-gray-300 mb-2 uppercase tracking-wider">{character.style}</p>
      <p className="text-gray-400">{character.description}</p>
    </div>
  );
};

export default CharacterCard;
