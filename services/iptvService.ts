
import { Channel } from '../types';

const PLAYLIST_URL = 'https://iptv-org.github.io/iptv/index.m3u';

export const fetchAndParsePlaylist = async (): Promise<Channel[]> => {
  try {
    const response = await fetch(PLAYLIST_URL);
    if (!response.ok) throw new Error('Failed to fetch playlist');
    
    const text = await response.text();
    const lines = text.split('\n');
    const channels: Channel[] = [];
    
    let currentChannel: Partial<Channel> = {};

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('#EXTINF:')) {
        // Extract metadata using regex
        const nameMatch = line.match(/,(.*)$/);
        const logoMatch = line.match(/tvg-logo="([^"]*)"/);
        const groupMatch = line.match(/group-title="([^"]*)"/);
        const idMatch = line.match(/tvg-id="([^"]*)"/);

        currentChannel = {
          id: idMatch ? idMatch[1] : Math.random().toString(36).substr(2, 9),
          name: nameMatch ? nameMatch[1].trim() : 'Unknown Channel',
          logo: logoMatch ? logoMatch[1] : 'https://via.placeholder.com/300x200?text=TV',
          category: groupMatch ? groupMatch[1] : 'General',
        };
      } else if (line.startsWith('http')) {
        currentChannel.url = line;
        if (currentChannel.name && currentChannel.url) {
          channels.push(currentChannel as Channel);
        }
        currentChannel = {};
      }
    }

    return channels;
  } catch (error) {
    console.error('Error parsing playlist:', error);
    throw error;
  }
};

// Helper to categorize channels more intuitively based on common group-title patterns
export const getNormalizedCategory = (groupTitle: string): string => {
  const title = groupTitle.toLowerCase();
  if (title.includes('news')) return 'News';
  if (title.includes('sport')) return 'Sports';
  if (title.includes('movie') || title.includes('cinema') || title.includes('film')) return 'Movies';
  if (title.includes('kid') || title.includes('cartoon') || title.includes('animation')) return 'Kids';
  if (title.includes('drama') || title.includes('series')) return 'Telidrama';
  if (title.includes('xxx') || title.includes('adult') || title.includes('porn')) return 'Adults';
  if (title.includes('music')) return 'Music';
  if (title.includes('documentary') || title.includes('education')) return 'Documentary';
  return 'General';
};
