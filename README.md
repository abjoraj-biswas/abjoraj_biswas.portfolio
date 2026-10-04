# 🌑 Abjoraj Biswas — Developer Portfolio

A minimalist, cinematic, high-end developer portfolio designed to showcase my projects, experience, and journey as a builder. Engineered with a focus on fluid animations, premium typography, and a modern dark-mode aesthetic.

> **Explore the live build:** [abjoraj-biswas.github.io/abjoraj_biswas.portfolio](https://github.com/abjoraj-biswas/abjoraj_biswas.portfolio) *(Update with your live link once deployed)*

---

## 🧠 Core Architecture & Features

### 1. 🎬 Cinematic Apple-Style Scrolling
- **Fluid Scroll Physics**: Integrated with `Lenis.js` for buttery-smooth `lerp` scroll interpolation.
- **Dynamic Hero Scaling**: Parallax scroll effects that dramatically scale up and fade out the hero content over a `200vh` sticky scroll tunnel, providing an ultra-premium Apple-like intro.

### 2. 🕸️ Dynamic Neural Canvas
- **Physics-Based Engine**: A custom HTML5 Canvas background featuring an interactive neural network and particle web.
- **Layered Visibility**: Deliberately configured z-indexes and translucent elements to allow the neural background to bleed beautifully into the content.

### 3. 🖱️ Custom Trailing Cursor System
- **Dual Element Tracking**: A precise center dot (`#cursor-dot`) followed by a lagging ring (`#cursor-ring`) for fluid interaction.
- **Intelligent State Management**: Automatically hides when leaving the window via `mouseleave` / `mouseenter` event listeners to prevent orphaned cursors.

### 4. 🗄️ Dynamic GitHub Integration
- **Live Data Fetching**: Automatically fetches and parses your latest GitHub repositories directly via the GitHub REST API.
- **Glassmorphism Cards**: Renders repositories into beautiful translucent panels with blurred backgrounds and subtle hover elevations.

### 5. ✒️ Hand-Curated Premium Typography
- **Modern Headings**: Integrates *Caviar Dreams* for clean, modern sans-serif headings.
- **Authentic Typewriter Vibe**: Features locally-hosted *Elegant Typewriter* and *Type Machine* fonts for an authentic, vintage coding aesthetic.

### 6. ✨ Scroll Reveal Animations
- **Intersection Observer Logic**: Employs `IntersectionObserver` to detect when elements enter the viewport, triggering smooth slide-up and fade-in `.reveal` animations as you scroll down the page.

### 7. ⏳ Vertical Experience Timeline
- **Elegant History**: A dedicated Experience & Education section mapped onto a vertical timeline with glowing nodes and glassmorphism detail cards that elevate on hover.

---

## 🛠️ Technology Stack

| Category | Technologies Used |
| :--- | :--- |
| **Core Languages** | HTML5, CSS3, JavaScript (ES6+) |
| **Styling & UI** | Vanilla CSS Custom Properties (Variables), Flexbox, CSS Grid, Glassmorphism |
| **Animations** | Keyframe Animations, CSS Transitions |
| **Scroll Engine** | Lenis.js (Smooth scrolling interpolation) |
| **Dynamic Data** | GitHub REST API, HTML5 Canvas API |

---

## 📁 Repository Directory Structure

```
Portfolio/
├── index.html          # Main HTML semantic structure & layout
├── css/
│   └── style.css       # Core styling, animations, and theme variables
├── js/
│   └── app.js          # Logic: Canvas engine, Cursor tracking, Lenis scroll, API fetching
├── images/             # Profile pictures and graphical assets
├── fonts/              # Custom locally-hosted typography
│   ├── ELEGANT TYPEWRITER Regular.ttf
│   └── Type Machine.ttf
└── README.md           # This documentation file
```

---

## 🚀 Local Setup & Installation

### Prerequisites
- A modern web browser.
- (Optional) A local server environment like VS Code Live Server for the best experience.

### Installation Steps

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/abjoraj-biswas/abjoraj_biswas.portfolio.git
   cd abjoraj_biswas.portfolio
   ```

2. **Run Locally**:
   - You can simply double-click `index.html` to open it in your browser.
   - For optimal performance (especially for the GitHub API fetch and Canvas engine), open the folder in VS Code and use the **Live Server** extension.

---

## 🌐 Contact & Social Links

- **GitHub**: [github.com/abjoraj](https://github.com/abjoraj)
- **LinkedIn**: *(Insert your LinkedIn Link)*
- **Email**: *(Insert your Email Address)*

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for details.
