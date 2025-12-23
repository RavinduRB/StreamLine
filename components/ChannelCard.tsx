
import React from 'react';
import { Play, Star, Info } from 'lucide-react';
import { Channel } from '../types';

interface ChannelCardProps {
  channel: Channel;
  isFavorite: boolean;
  onSelect: (channel: Channel) => void;
  onToggleFavorite: (id: string) => void;
}

const ChannelCard: React.FC<ChannelCardProps> = ({ channel, isFavorite, onSelect, onToggleFavorite }) => {
  return (
    <div 
      className="group relative bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700 hover:border-blue-500/50 hover:bg-slate-800 transition-all duration-300 transform hover:-translate-y-1"
    >
      <div className="aspect-video relative overflow-hidden bg-slate-900 flex items-center justify-center p-4">
        <img 
          src={channel.logo} 
          alt={channel.name}
          className="max-w-full max-h-full object-contain filter drop-shadow-md group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(channel.name);
          }}
        />
        
        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={() => onSelect(channel)}
            className="p-4 bg-white text-blue-600 rounded-full shadow-xl transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75"
          >
            <Play size={24} fill="currentColor" />
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2 right-2 flex gap-1">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(channel.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors ${
              isFavorite ? 'bg-yellow-500 text-white' : 'bg-black/40 text-white/70 hover:bg-black/60 hover:text-white'
            }`}
          >
            <Star size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-slate-100 truncate flex-1" title={channel.name}>
            {channel.name}
          </h3>
          <span className="text-[10px] uppercase tracking-wider font-bold text-blue-400 bg-blue-400/10 px-1.5 py-0.5 rounded">
            HD
          </span>
        </div>
        <p className="text-xs text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
          {channel.category}
        </p>
      </div>
    </div>
  );
};

export default ChannelCard;
