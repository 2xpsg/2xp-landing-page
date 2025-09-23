# 2XP SG Landing Page

A modern, responsive single-page website for 2XP SG - a digital agency focused on building SaaS products for the education sector.

## 🌟 Features

- **Dark Theme Design**: Modern, futuristic aesthetic with purple (#7F5AF0) and electric blue (#00CFFF) accents
- **Interactive Particle Background**: Responsive tsParticles animation with mouse hover and click interactions
- **Fully Responsive**: Optimized for mobile, tablet, and desktop devices
- **Smooth Animations**: Fade-in effects and smooth scrolling navigation
- **Accessibility**: Semantic HTML, proper contrast ratios, and keyboard navigation support
- **No Build Process**: Pure HTML with Tailwind CSS - ready to deploy

## 🎨 Design Specifications

### Color Palette
- Background: `#0d0d0d` (very dark gray)
- Purple Accent: `#7F5AF0`
- Electric Blue: `#00CFFF`
- Text: `#e5e7eb` (light gray)
- Highlights: White

### Typography
- Font Family: Inter (Google Fonts)
- Modern sans-serif styling
- Gradient text effects for headings

### Interactive Elements
- Particle network background with tsParticles v2.12.0
- **GSAP ScrollTrigger animations** with tumbling floating images
- Parallax scroll effects with custom easing
- Hover effects with glow animations
- Enhanced smooth scrolling navigation with keyboard support
- Mobile-responsive hamburger menu

## 📁 Project Structure

```
2xp-landing-page/
├── index.html          # Main website file
├── README.md           # Project documentation
└── CLAUDE.md          # Claude Code guidance
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Local web server (optional, for development)

### Quick Start
1. Clone or download the repository
2. Open `index.html` in your web browser
3. For development, serve with a local server:
   ```bash
   # Using Python
   python -m http.server 8000

   # Using Node.js
   npx serve .

   # Using PHP
   php -S localhost:8000
   ```

### Deployment
The site is deployment-ready for any static hosting service:
- **Netlify**: Drop the folder or connect to Git
- **Vercel**: Deploy with `vercel` command
- **GitHub Pages**: Push to a repository and enable Pages
- **Traditional Hosting**: Upload files to web root directory

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🧩 Dependencies

All dependencies are loaded via CDN:
- **Tailwind CSS**: `https://cdn.tailwindcss.com`
- **Google Fonts**: Inter font family
- **tsParticles Engine**: `tsparticles-engine@2.12.0`
- **tsParticles Slim**: `tsparticles-slim@2.12.0`
- **GSAP Core**: `gsap@3.12.2`
- **GSAP ScrollTrigger**: `ScrollTrigger@3.12.2`

## 📧 Contact

For inquiries about 2XP SG services, contact:
- Email: hello@2xp.sg

## 📄 License

© 2024 2XP Private Limited. All rights reserved.

## 🛠️ Development Notes

### Customization
- Colors can be modified in the Tailwind config within the `<script>` tag
- Particle settings are configurable in the tsParticles initialization
- Content updates can be made directly in the HTML

### Performance
- Optimized particle count for smooth performance
- Lazy loading for better initial page load
- Minimized external dependencies

### SEO Ready
- Semantic HTML structure
- Meta tags for search engines
- Proper heading hierarchy
- Alt text for images