# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the 2XP SG landing page - a modern, single-page website for a digital agency focused on building SaaS products for the education sector.

## Technology Stack

- **Frontend**: Pure HTML5 with Tailwind CSS (via CDN)
- **Styling**: Dark theme with purple (#7F5AF0) and electric blue (#00CFFF) accents
- **Typography**: Inter font family from Google Fonts
- **Animations**: tsParticles v2.12.0 for interactive particle background
- **No Build Process**: Static site ready for immediate deployment

## Key Files

- `index.html` - Main website file with all content and functionality
- `README.md` - Project documentation and setup instructions
- `CLAUDE.md` - This guidance file

## Development Commands

### Local Development
```bash
# Serve locally using Python
python -m http.server 8000

# Serve locally using Node.js
npx serve .

# Serve locally using PHP
php -S localhost:8000
```

### Deployment
No build process required - deploy static files directly to any hosting service.

## Architecture Notes

### Design System
- Dark mode theme (#0d0d0d background)
- Gradient text effects for headings
- Glass-morphism cards with backdrop blur
- Responsive grid layouts using Tailwind CSS

### Interactive Features
- tsParticles background with mouse hover/click interactions
- Smooth scrolling navigation
- Fade-in animations triggered by scroll position
- Mobile hamburger menu

### Content Structure
1. **Hero Section**: Large gradient title with CTA
2. **About Section**: Founder story and company stats
3. **Services Section**: Three service cards with icons
4. **Contact Section**: Email CTA with mailto link
5. **Footer**: Copyright information

### Accessibility Features
- Semantic HTML5 structure
- High contrast colors for dark mode
- Keyboard navigation support
- Screen reader friendly markup
- Responsive design for all devices

## Common Modifications

### Content Updates
- All content is in `index.html` - no external content files
- Company information is in the About section
- Service descriptions are in the Services section cards
- Contact email is `hello@2xp.sg`

### Style Customizations
- Colors defined in Tailwind config within `<script>` tag
- Particle settings in tsParticles initialization
- Custom CSS in `<style>` tag for gradients and animations

### Performance Considerations
- All dependencies loaded via CDN
- Optimized particle count (80 particles)
- Efficient intersection observer for animations
- Minimal external requests