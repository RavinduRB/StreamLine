
import React, { useState, useEffect, useMemo } from 'react';
// Added Globe and Tv to the imports to resolve "Cannot find name" errors
import { Search, Menu, X, Play, Heart, ChevronRight, LayoutGrid, AlertCircle, Loader2, Globe, Tv } from 'lucide-react';
import { fetchAndParsePlaylist, getNormalizedCategory } from './services/iptvService';
import { Channel, Category } from './types';
import Sidebar from './components/Sidebar';
import ChannelCard from './components/ChannelCard';
import VideoPlayer from './components/VideoPlayer';

const App: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('streamline_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [adultEnabled, setAdultEnabled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const loadChannels = async () => {
      try {
        setLoading(true);
        const data = await fetchAndParsePlaylist();
        
        // Enrich data with normalized categories
        const enriched = data.map(ch => ({
          ...ch,
          category: getNormalizedCategory(ch.category)
        }));

        setChannels(enriched);
        setError(null);
      } catch (err) {
        setError('Unable to load TV channels. Please check your connection.');
      } finally {
        setLoading(false);
      }
    };
    loadChannels();
  }, []);

  useEffect(() => {
    localStorage.setItem('streamline_favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredChannels = useMemo(() => {
    let result = channels;

    // Filter by Search
    if (searchQuery) {
      result = result.filter(ch => 
        ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ch.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by Category
    if (selectedCategory === 'Favorites') {
      result = result.filter(ch => favorites.includes(ch.id));
    } else if (selectedCategory === 'Popular') {
      result = result.slice(0, 50); // Just a simulation of "popular"
    } else if (selectedCategory !== 'All') {
      result = result.filter(ch => ch.category === selectedCategory);
    }

    // Safety Filter
    if (!adultEnabled) {
      result = result.filter(ch => ch.category !== 'Adults');
    }

    return result;
  }, [channels, searchQuery, selectedCategory, favorites, adultEnabled]);

  const featuredChannel = useMemo(() => {
    return channels.length > 0 ? channels[Math.floor(Math.random() * Math.min(channels.length, 20))] : null;
  }, [channels]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white space-y-6">
        <div className="flex items-center gap-3 text-blue-500 scale-150 mb-8">
          <div className="p-2 bg-blue-500 rounded-lg">
            <Play className="text-white" fill="white" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white">STREAM<span className="text-blue-500">LINE</span></span>
        </div>
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium animate-pulse">Initializing Global Broadcasts...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-900 text-slate-100 selection:bg-blue-500/30">
      <Sidebar 
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          setMobileMenuOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        adultEnabled={adultEnabled}
        onToggleAdult={() => setAdultEnabled(!adultEnabled)}
        favoritesCount={favorites.length}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between gap-6 max-w-[1600px] mx-auto">
            <button 
              className="lg:hidden p-2 text-slate-400 hover:text-white"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>

            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search channels, genres, or events..."
                className="w-full bg-slate-800 border-transparent focus:border-blue-500/50 focus:ring-0 rounded-full pl-10 pr-4 py-2.5 text-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{channels.length} Channels</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-sm font-bold shadow-lg shadow-blue-500/20">
                JD
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full">
          
          {selectedChannel ? (
            <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <VideoPlayer 
                    channel={selectedChannel} 
                    onNext={() => {}} 
                  />
                  <div className="mt-6 flex items-start justify-between">
                    <div>
                      <h1 className="text-3xl font-black tracking-tight mb-2">{selectedChannel.name}</h1>
                      <div className="flex items-center gap-4 text-slate-400">
                        <span className="px-2 py-0.5 bg-slate-800 rounded text-xs font-bold border border-slate-700">{selectedChannel.category}</span>
                        <span className="flex items-center gap-1.5 text-sm">
                          <Globe size={14} className="text-blue-500" /> Global Stream
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button 
                        onClick={() => toggleFavorite(selectedChannel.id)}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${
                          favorites.includes(selectedChannel.id) 
                            ? 'bg-yellow-500 text-white' 
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <Heart size={18} fill={favorites.includes(selectedChannel.id) ? "currentColor" : "none"} />
                        {favorites.includes(selectedChannel.id) ? 'Saved' : 'Favorite'}
                      </button>
                      <button 
                        onClick={() => setSelectedChannel(null)}
                        className="px-6 py-2.5 bg-slate-800 text-slate-300 hover:bg-slate-700 rounded-full font-bold"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Side Recommendations */}
                <div className="lg:w-80">
                  <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
                    Recommended <ChevronRight size={18} />
                  </h3>
                  <div className="space-y-4">
                    {channels.slice(0, 5).map(ch => (
                      <div 
                        key={`rec-${ch.id}`}
                        onClick={() => setSelectedChannel(ch)}
                        className="flex items-center gap-4 p-3 bg-slate-800/40 hover:bg-slate-800 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-700"
                      >
                        <div className="w-20 h-12 bg-slate-900 rounded-lg flex items-center justify-center p-2">
                          <img src={ch.logo} className="max-w-full max-h-full object-contain" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold truncate">{ch.name}</h4>
                          <p className="text-[10px] text-slate-500 uppercase">{ch.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          ) : featuredChannel && selectedCategory === 'All' && !searchQuery ? (
            <section className="relative h-[400px] mb-12 rounded-3xl overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-slate-900">
                <img 
                  src={`https://picsum.photos/seed/${featuredChannel.id}/1600/900`}
                  className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-1000"
                  alt="Featured"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-8 lg:p-12 w-full max-w-2xl">
                <span className="inline-block px-3 py-1 bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em] rounded mb-4">Trending Live</span>
                <h1 className="text-4xl lg:text-6xl font-black mb-4 tracking-tighter leading-tight">{featuredChannel.name}</h1>
                <p className="text-slate-300 mb-8 text-lg font-medium leading-relaxed">
                  Join millions watching {featuredChannel.name} live. High-definition streaming with no lag and real-time broadcast metadata.
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setSelectedChannel(featuredChannel)}
                    className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-black flex items-center gap-3 shadow-xl shadow-blue-600/20 transition-all hover:scale-105"
                  >
                    <Play size={20} fill="currentColor" /> WATCH NOW
                  </button>
                  <button 
                    onClick={() => toggleFavorite(featuredChannel.id)}
                    className="px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-black flex items-center gap-3 transition-all"
                  >
                    <Heart size={20} /> ADD TO LIST
                  </button>
                </div>
              </div>
            </section>
          ) : null}

          {/* Section Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">{selectedCategory === 'All' ? 'Browse All Channels' : selectedCategory}</h2>
              <p className="text-slate-500 text-sm">{filteredChannels.length} streams found matching your criteria</p>
            </div>
            <div className="flex items-center gap-2">
               <button className="p-2 bg-slate-800 text-slate-400 rounded-lg hover:text-white transition-colors">
                <LayoutGrid size={20} />
              </button>
            </div>
          </div>

          {/* Grid */}
          {filteredChannels.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {filteredChannels.map((ch) => (
                <ChannelCard 
                  key={ch.id + ch.url}
                  channel={ch}
                  isFavorite={favorites.includes(ch.id)}
                  onSelect={setSelectedChannel}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-800/20 rounded-3xl border border-dashed border-slate-700">
              <AlertCircle size={48} className="text-slate-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-300">No channels found</h3>
              <p className="text-slate-500 mt-2">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="mt-6 text-blue-500 font-bold hover:underline"
              >
                Reset all filters
              </button>
            </div>
          )}

          {/* Back to Top Indicator */}
          {filteredChannels.length > 20 && (
            <div className="mt-12 py-8 flex flex-col items-center border-t border-slate-800">
              <p className="text-slate-500 text-sm mb-4">You've reached the end of the list.</p>
              <button 
                onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-full text-sm font-bold transition-colors"
              >
                Back to Top
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="bg-slate-900 border-t border-slate-800 py-12 px-6 mt-12">
          <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-3 text-blue-500 mb-6">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Tv size={24} className="text-white" />
                </div>
                <span className="text-2xl font-black tracking-tighter text-white">STREAM<span className="text-blue-500">LINE</span></span>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                StreamLine is a modern IPTV streaming platform providing seamless access to thousands of global live TV channels. Enjoy your favorite content anywhere, anytime.
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                  <Globe size={20} />
                </div>
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-slate-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                  <Search size={20} />
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Navigation</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Popular Content</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">My Favorites</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Legal & Compliance</h4>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Copyright (DMCA)</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Disclaimer</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black mb-6 uppercase tracking-widest text-xs">Newsletter</h4>
              <p className="text-slate-500 text-sm mb-4">Stay updated with new channels and features.</p>
              <div className="flex gap-2">
                <input type="email" placeholder="Email Address" className="flex-1 bg-slate-800 border-none rounded-lg px-4 py-2 text-sm focus:ring-1 focus:ring-blue-500" />
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold text-sm">Join</button>
              </div>
            </div>
          </div>
          <div className="max-w-[1600px] mx-auto mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-[10px] font-bold uppercase tracking-widest">
            <p>&copy; 2024 STREAMLINE IPTV. ALL RIGHTS RESERVED.</p>
            <p>CONTENT SOURCED FROM EXTERNAL OPEN PLAYLISTS. WE DO NOT HOST STREAMS.</p>
          </div>
        </footer>
      </main>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="relative w-72 h-full bg-slate-900 shadow-2xl flex flex-col p-6 animate-in slide-in-from-left duration-300">
            <button className="absolute top-6 right-6 p-2 text-slate-400" onClick={() => setMobileMenuOpen(false)}>
              <X size={24} />
            </button>
            
            <div className="flex items-center gap-3 text-blue-500 mb-12">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Tv className="text-white" size={20} />
              </div>
              <span className="text-xl font-black tracking-tighter text-white">STREAM<span className="text-blue-500">LINE</span></span>
            </div>

            <nav className="flex-1 space-y-2 overflow-y-auto">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Categories</p>
              {['All', 'Popular', 'Favorites', 'Movies', 'Telidrama', 'Sports', 'Kids', 'News'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => { setSelectedCategory(cat); setMobileMenuOpen(false); }}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-colors ${
                    selectedCategory === cat ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </nav>
            
            <div className="pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-sm font-bold">Adult Content</span>
                <button 
                  onClick={() => setAdultEnabled(!adultEnabled)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${adultEnabled ? 'bg-blue-600' : 'bg-slate-800'}`}
                >
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${adultEnabled ? 'translate-x-6' : ''}`}></div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
