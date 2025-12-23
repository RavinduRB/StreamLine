
import React from 'react';
import { 
  Tv, 
  Film, 
  Heart, 
  Globe, 
  Trophy, 
  Baby, 
  ShieldAlert, 
  Flame,
  LayoutGrid,
  Search,
  Settings,
  Info
} from 'lucide-react';
import { Category } from '../types';

interface SidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  adultEnabled: boolean;
  onToggleAdult: () => void;
  favoritesCount: number;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  selectedCategory, 
  onSelectCategory, 
  adultEnabled, 
  onToggleAdult,
  favoritesCount
}) => {
  const navItems = [
    { id: 'All', label: 'All Channels', icon: LayoutGrid },
    { id: 'Popular', label: 'Popular', icon: Flame },
    { id: 'Favorites', label: 'My Favorites', icon: Heart, count: favoritesCount },
    { id: 'Movies', label: 'Movies & Films', icon: Film },
    { id: 'Telidrama', label: 'Telidrama', icon: Tv },
    { id: 'Sports', label: 'Sports', icon: Trophy },
    { id: 'Kids', label: 'Kids & Family', icon: Baby },
    { id: 'International', label: 'Global TV', icon: Globe },
    { id: 'News', label: 'News', icon: Search },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-72 bg-slate-900 border-r border-slate-800 h-screen sticky top-0">
      <div className="p-8">
        <div className="flex items-center gap-3 text-blue-500">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Tv className="text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">STREAM<span className="text-blue-500">LINE</span></span>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Browse Categories</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = selectedCategory === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectCategory(item.id)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-blue-400'} />
                <span className="font-medium">{item.label}</span>
              </div>
              {item.count !== undefined && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                }`}>
                  {item.count}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-8 pb-4">
          <p className="px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Safety</p>
          <div className="px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldAlert size={20} />
                <span className="font-medium text-sm">Adult Content</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={adultEnabled}
                  onChange={onToggleAdult}
                />
                <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </nav>

      <div className="p-6 border-t border-slate-800">
        <div className="flex items-center gap-4 text-slate-400">
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Settings size={20} /></button>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors"><Info size={20} /></button>
          <div className="ml-auto flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] font-bold uppercase tracking-tight">System Online</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
