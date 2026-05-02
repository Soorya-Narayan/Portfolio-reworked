# Windows 95/98 Retro Portfolio

A high-fidelity, interactive web-based portfolio that replicates the classic Windows 95/98 desktop experience. Built with modern web technologies, this project features draggable windows, a functional taskbar, authentic system animations, and a curated project registry.

## 🚀 Tech Stack

- **Core**: [React 19](https://react.dev/) (Vite)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: React Hooks (useState, useEffect, useRef)
- **Animations**: Tailwind Transitions & Custom Keyframes
- **Deployment**: Vite (Production Build)

## 🖥️ Theme Features

### 1. Authentic Windows Desktop
- **Window Management**: Fully draggable and dynamically resizable application windows.
- **Taskbar**: Persistent taskbar that tracks open windows and manages z-index.
- **Start Menu**: Retro-styled Start Menu for quick access to projects, resume, and system settings.
- **3D Bevel Utilities**: Custom Tailwind utilities (`win-outset`, `win-inset`) to achieve the iconic 90s OS look.

### 2. Immersive System Animations
- **Boot Sequence**: Authentic Windows 95 splash screen with a procedural loading bar and startup sound.
- **Shutdown/Restart**: Nostalgic shutdown sequence with specific animations and "Restarting..." states.
- **Audio**: Integrated classic Windows 95 system sounds for boot up and shutdown actions.

### 3. Integrated Content
- **Project Registry**: Detailed list of 10+ technical projects, each with its own description, tech stack, and source links.
- **Article Reader**: Support for Medium articles, research papers (IJFMR), and PDF guides (SIMATIC IPC).
- **Settings Control Panel**: Customizable desktop wallpapers (Teal, Plum, Desert, etc.) and clock toggle functionality.

## 🛠️ Setup & Local Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Soorya-Narayan/Portfolio-reworked.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run in development mode**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

- `src/App.jsx`: Core application logic, window management, and state handling.
- `src/index.css`: Custom Tailwind v4 theme definitions and retro 3D bevel utilities.
- `public/`: Static assets including Resume PDF, Research papers, and favicon.

---
Built with nostalgic precision by **Surya Narayan**.
