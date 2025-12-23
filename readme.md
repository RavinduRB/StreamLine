# 📺 StreamLine

StreamLine is a modern, high performance live TV streaming platform designed to provide a seamless "lean back" experience across all devices. It leverages open source IPTV playlists to deliver thousands of global channels with a professional, industry standard interface.



https://github.com/user-attachments/assets/a721a365-a1a9-4342-90de-e62644b7c746



## 🚀 Overview

The application is built to bridge the gap between complex IPTV playlists and end users by providing an intuitive, Netflix inspired UI. It automatically parses `.m3u` sources, categorizes them using intelligent keyword mapping, and provides a robust HLS video player for low latency streaming.

## ✨ Key Features

### 1. High Performance Streaming
- **HLS.js Integration:** Adaptive bitrate streaming support for smooth playback.
- **Auto Reconnect:** Intelligent error handling that attempts to recover streams during network interruptions.
- **Picture in Picture (PiP):** Supports browser native PiP for multitasking.
- **Live Status:** Visual indicators for real time broadcasts.

### 2. Intelligent Categorization
- **Smart Grouping:** Automatically sorts channels into categories: Movies, Kids, Sports, News, Teledrama, and International.
- **Adult Content Filter:** A secure toggle to hide/show age restricted content.
- **Global Search:** Instant fuzzy searching across thousands of channel names.

### 3. User Experience
- **Netflix Style Layout:** A grid based design optimized for visual discovery.
- **Favorites System:** Save your most watched channels; persistent across sessions using LocalStorage.
- **Responsive Design:** Mobile first approach ensuring compatibility from smartphones to 4K desktops.
- **Lazy Loading:** High performance rendering of large channel lists to ensure 60FPS scrolling.

### 4. Aesthetics & UI
- **Glassmorphism:** Modern UI elements with backdrop blurs and subtle borders.
- **Dynamic Theming:** Deep slate/blue dark mode optimized for late night viewing.
- **Skeleton States:** Smooth loading transitions while fetching the global playlist.

## 🛠️ Technology Stack

- **Frontend Core:** [React 19](https://react.dev/) (Functional Components, Hooks, Memoization)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Utility first responsive design)
- **Video Engine:** [HLS.js](https://github.com/video-dev/hls.js/) (HTTP Live Streaming)
- **Icons:** [Lucide React](https://lucide.dev/) (Modern, consistent iconography)
- **Type Safety:** TypeScript (Strict typing for channel data and app state)
- **Data Source:** [IPTV-org](https://iptv-org.github.io/) (Open source global playlist)
- **Typography:** Google Fonts (Inter)

## ✨ How to run

- Step 1: Download and unzip the entire code folder.
- Step 2: Open this folder in VSCode.
- Step 3: Run the commands "npm install" and "npm run dev" in the VSCode terminal.

## 🧊 StreamLine Web Application UI
1. Home Page
<img width="1919" height="897" alt="Home Page" src="https://github.com/user-attachments/assets/27c9e7db-5768-4d32-a454-a45e52ca3c66" />

2. Channels View
<img width="1919" height="900" alt="Channels View" src="https://github.com/user-attachments/assets/e6328667-ab65-4e1a-8798-6e3db6c3a297" />

## ⚖️ Disclaimer

StreamLine is a media player interface. It does **not** host, own, or manage any of the streaming content. All streams are sourced from external, publicly available `.m3u` playlists. Users are responsible for ensuring they have the rights to view the content accessed via the platform.
