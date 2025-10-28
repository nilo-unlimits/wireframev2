# Unlimits Wireframe Components

This directory contains reusable components for the Unlimits Dreams Dashboard wireframe.

## Components

### Header Component (`header.html`)

**Includes:**
- iOS-style status bar with time, signal, wifi, and battery indicators
- Welcome message with user name
- Credits display in pill format (5.2K with lightning icon)
- User avatar circle
- Menu button in circular container with burger icon

**Dependencies:**
- Requires Lucide icons library for menu icon
- Uses SORA font family
- Needs CSS variables for consistent styling

### Footer Component (`footer.html`)

**Includes:**
- Bottom navigation with 5 items:
  - Explore (compass icon)
  - Dreams (star icon) 
  - Future Self (FS liquid orb in center)
  - Challenges (trophy icon)
  - Meditation (headphones icon)
- Home indicator bar
- Floating FS circle for when footer is hidden
- Glassmorphism Future Self orb with liquid effects

**Dependencies:**
- Requires Lucide icons library for navigation icons
- JavaScript for page navigation and scroll behavior
- CSS for glassmorphism effects on FS orb

## Usage

To use these components:

1. Include the Lucide icons library:
   ```html
   <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/lucide@latest/dist/umd/lucide.css">
   <script src="https://unpkg.com/lucide@latest/dist/umd/lucide.js"></script>
   ```

2. Copy the HTML from component files into your wireframe
3. Ensure CSS styles are included for proper rendering
4. Initialize icons with `lucide.createIcons()`

## Features

- **Responsive Design**: Optimized for 360px mobile width
- **iOS Styling**: Authentic iOS design patterns and typography
- **Interactive Elements**: Hover states, transitions, and animations
- **Accessibility**: Proper semantic markup and focus states
- **Theme Support**: Works with light/dark mode switcher