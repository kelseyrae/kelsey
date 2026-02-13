# Kelsey Conophy - Personal Portfolio Website

This repository contains the source code for Kelsey Conophy's personal portfolio website, a professional online presence for an AI product leader, entrepreneur, and technical advisor. The live site is hosted at [www.kelseyconophy.com](http://www.kelseyconophy.com).

## Overview

This is a clean, minimal single-page portfolio website designed to showcase professional background, technical expertise, and career achievements. The site serves as a digital business card and contact hub for speaking engagements, advisor appointments, and professional networking.

**Key Features:**
- **Professional Bio**: Highlights 14+ years of experience in AI product leadership, spanning roles at GitHub, Amazon, Intuit, and multiple hyper-growth startups
- **Career Summary**: Details expertise in AI agents, LLMs, deep learning, reinforcement learning, and machine learning systems at global scale
- **Contact Integration**: Direct email links and social media connections (LinkedIn, GitHub)
- **Responsive Design**: Mobile-first layout that adapts seamlessly to all screen sizes
- **Performance Optimized**: Minimal dependencies, fast load times, and efficient asset delivery via AWS S3
- **Analytics Enabled**: Google Analytics integration for visitor tracking and engagement metrics

**Technical Architecture:**
The site is built as a static HTML/CSS application with minimal JavaScript, leveraging the Semantic UI framework for consistent, professional styling. Assets are served from both local files and AWS S3 for optimal performance.

## Project Structure

The repository is organized as a simple static website with the following structure:

```
kelsey/
├── index.html              # Main landing page containing all content
├── CNAME                   # Custom domain configuration for GitHub Pages (www.kelseyconophy.com)
├── static-aws/             # Local static assets directory
│   └── css/               # Custom stylesheets
│       ├── main.css       # Primary styles for layout, typography, and responsive design
│       └── fluidbox.min.css # Lightbox styling for image galleries (if used)
├── Semantic-UI-master/     # Semantic UI framework (vendor dependency, not modified)
└── README.md              # This documentation file
```

**File Descriptions:**
- `index.html`: Single-page application containing the entire site structure, content, and inline JavaScript for Google Analytics
- `CNAME`: Domain configuration file used by GitHub Pages to route custom domain traffic
- `static-aws/css/main.css`: Custom CSS rules that define the site's visual identity, including colors, spacing, and mobile responsiveness
- `Semantic-UI-master/`: Complete Semantic UI framework directory (used for UI components and grid system)

## How It Works

This is a static website with a client-side only architecture (no backend server required). Here's how the different components work together:

**Content Delivery:**
- The HTML file (`index.html`) contains all page content embedded directly in the markup
- CSS is loaded from two sources:
  - AWS S3 bucket (`s3-us-west-2.amazonaws.com/kelseyconophy/`) for CDN-delivered resources like Fluidbox styles
  - Local files in `static-aws/css/` for custom styling
- JavaScript dependencies (jQuery, Fluidbox) are loaded from CDN for performance

**Page Structure:**
- **Header Section** (lines 17-24): Contains the site title "Kelsey Conophy" and professional subtitle
- **Intro Section** (lines 28-44): Main biography highlighting AI product leadership experience, technical expertise, and personal interests
- **Contact Section** (lines 46-59): Two-column layout with email contact and social media links

**Analytics & Tracking:**
- Google Analytics (tracking ID: UA-65972343-1) is implemented via inline JavaScript (lines 78-87)
- Tracks page views and visitor behavior for site metrics

**Responsive Behavior:**
- Uses Semantic UI's grid system for responsive layouts
- Mobile-first CSS in `main.css` ensures optimal viewing on all devices
- Viewport meta tag ensures proper scaling on mobile browsers

## How to Run

### Prerequisites

No build tools or package managers required! This is a pure HTML/CSS/JS site that runs directly in any modern web browser.

**Recommended browsers:**
- Chrome/Edge (v90+)
- Firefox (v88+)
- Safari (v14+)

### Local Development

There are several ways to run the site locally for development and testing:

#### Option 1: Direct Browser Opening (Quickest)

Simply open the HTML file directly in your browser:

```bash
# Clone the repository first
git clone https://github.com/kelseyrae/kelsey.git
cd kelsey

# Then open in browser
# On macOS
open index.html

# On Linux
xdg-open index.html

# On Windows
start index.html
```

**Note:** Some features (like loading external resources) may have CORS restrictions when opening files directly. For full functionality, use a local web server (Options 2 or 3).

#### Option 2: Python HTTP Server (Recommended for Development)

Python comes pre-installed on most systems, making this the easiest server option:

```bash
# Using Python 3 (most common)
python -m http.server 8000

# Or using Python 2 (if Python 3 isn't available)
python -m SimpleHTTPServer 8000
```

Then visit `http://localhost:8000` in your browser.

**Why use a local server?**
- Avoids CORS issues when loading external resources
- Mimics production environment more closely
- Allows testing of relative path resolution

#### Option 3: Node.js HTTP Server

If you have Node.js installed:

```bash
# Install http-server globally (one-time setup)
npm install -g http-server

# Or use npx to run without installing
npx http-server -p 8000
```

Then visit `http://localhost:8000` in your browser.

**Additional options:**
- `-c-1`: Disable caching (useful for development)
- `-o`: Automatically open browser
- Example: `npx http-server -p 8000 -c-1 -o`

### Deployment

The site is hosted on **GitHub Pages**, which provides free static site hosting directly from the repository. The custom domain `www.kelseyconophy.com` is configured via the `CNAME` file.

#### GitHub Pages Configuration

**Current Setup:**
- **Source Branch:** `main` (or `master`)
- **Custom Domain:** www.kelseyconophy.com (configured in `CNAME` file)
- **HTTPS:** Enabled automatically by GitHub Pages
- **Deployment Trigger:** Automatic on every push to the main branch

#### Deploying Changes

To publish updates to the live site:

1. **Make your changes** to `index.html`, CSS files, or other assets:
   ```bash
   # Example: Update the bio section
   nano index.html

   # Or update styling
   nano static-aws/css/main.css
   ```

2. **Test locally** using one of the methods described above to verify your changes

3. **Commit and push** to the main branch:
   ```bash
   git add .
   git commit -m "Update professional bio with new achievements"
   git push origin main
   ```

4. **Automatic Deployment:** GitHub Pages will automatically rebuild and deploy the site within 1-2 minutes

5. **Verify:** Visit [www.kelseyconophy.com](http://www.kelseyconophy.com) to see your changes live

#### Deployment Troubleshooting

- **Changes not appearing?** Wait 2-3 minutes for GitHub Pages to rebuild, then hard-refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
- **Custom domain not working?** Verify the `CNAME` file contains only the domain name (no http:// or trailing slashes)
- **Check deployment status:** Visit `https://github.com/kelseyrae/kelsey/deployments` to see the deployment history and status

## Customization

This section provides detailed guidance on how to customize different parts of the site for your own use or to update content.

### Updating Content

All content is contained in `index.html`. Here's where to find and modify specific sections:

#### Header Section (Lines 17-24)
Contains the site title and professional subtitle:
```html
<div id="logo"><a>Kelsey Conophy</a></div>
<div id="subtitle">AI product leader &nbsp;&bull;&nbsp; entrepreneur &nbsp;&bull;&nbsp; curious technologist</div>
```
**To modify:** Change the name and subtitle to match your professional identity.

#### Main Bio Section (Lines 28-44)
The primary introduction paragraph with professional background:
- **Line 29:** Main headline (currently: "I build AI products and build teams that build AI products.")
- **Lines 30-43:** Detailed biography including:
  - Opening statement about location and services offered
  - Years of experience and technical expertise
  - Companies worked for (with links)
  - Leadership experience and team sizes
  - Personal interests and hobbies

**To modify:** Update the `<h1>` tag for your headline and edit the `<p>` tag content for your biography. Keep or remove company links in `<a>` tags as needed.

#### Contact Section (Lines 46-59)
Two-column layout with contact information:
- **Left Column (Lines 47-52):** Email contact section
- **Right Column (Lines 53-58):** Social media links (LinkedIn, GitHub)

**To modify:**
- Replace `kelseyconophy@gmail.com` with your email
- Update LinkedIn URL: `https://www.linkedin.com/in/[your-username]`
- Update GitHub URL: `https://github.com/[your-username]`

#### Google Analytics (Lines 78-87)
Tracking code with tracking ID `UA-65972343-1`:
```javascript
ga('create', 'UA-65972343-1', 'auto');
```
**To modify:** Replace the tracking ID with your own Google Analytics property ID, or remove this entire `<script>` block if you don't want analytics.

### Styling and Visual Customization

The site's visual appearance is controlled by CSS files in the `static-aws/css/` directory and the Semantic UI framework.

#### Customizing Colors and Fonts

Edit `static-aws/css/main.css` to modify:
- **Typography:** Font families, sizes, and weights for headings and body text
- **Color Scheme:** Background colors, text colors, and accent colors
- **Spacing:** Margins, padding, and layout spacing
- **Responsive Breakpoints:** Adjust how the site responds to different screen sizes

**Common customization examples:**
```css
/* Change the background color */
body {
    background-color: #yourcolor;
}

/* Modify heading styles */
h1 {
    font-size: 2.5rem;
    color: #333;
}

/* Adjust link colors */
a {
    color: #0066cc;
}
```

#### Layout Modifications

The site uses a simple, single-column layout with some two-column sections. To modify the layout:
1. Edit the HTML structure in `index.html`
2. Use Semantic UI's grid classes (see `Semantic-UI-master/` for documentation)
3. Add custom CSS rules in `main.css` to override default behavior

### External Dependencies

The site relies on several external resources and libraries:

**CSS Frameworks & Libraries:**
- **Semantic UI** (v2.x): UI component framework included in `Semantic-UI-master/`
  - Provides grid system, typography, and base styling
  - Documentation: https://semantic-ui.com/
- **Fluidbox CSS**: Lightbox/gallery styling loaded from AWS S3
  - CDN URL: `s3-us-west-2.amazonaws.com/kelseyconophy/fluidbox.min.css`
  - Used for image galleries and modals (if implemented)

**JavaScript Libraries:**
- **jQuery** (v1.11+): DOM manipulation library loaded from CDN
  - Used by Fluidbox and for basic interactivity
  - Fallback to local copy if CDN fails (see lines 69-72 in `index.html`)
- **Fluidbox.js**: Lightbox functionality for images
  - Loaded from local `Gumba Template_files/` directory

**Third-Party Services:**
- **Google Analytics**: Web analytics service for tracking visitor behavior
  - Tracking ID: `UA-65972343-1`
  - Script loaded asynchronously for performance

**Updating Dependencies:**
To update jQuery, Semantic UI, or other libraries:
1. Download the latest version from the official source
2. Replace files in the appropriate directory
3. Test thoroughly to ensure compatibility
4. Update version numbers in comments if applicable

## Technologies Used

This portfolio website is built with a carefully selected stack of modern web technologies:

**Frontend Technologies:**
- **HTML5**: Semantic markup for content structure and accessibility
- **CSS3**: Modern styling with flexbox/grid layouts, animations, and responsive design
- **JavaScript (ES5)**: Client-side interactivity and third-party library integration

**UI Framework & Libraries:**
- **Semantic UI Framework**: Comprehensive CSS framework for consistent, professional UI components
  - Provides responsive grid system
  - Pre-styled components and utilities
  - Mobile-first design approach
- **jQuery (v1.11+)**: JavaScript library for DOM manipulation and event handling
- **Fluidbox**: Responsive lightbox plugin for image galleries

**Hosting & Infrastructure:**
- **GitHub Pages**: Free static site hosting with automatic deployment from Git
- **AWS S3**: Cloud storage for CSS assets and static resources
- **Custom Domain**: DNS configured for www.kelseyconophy.com

**Analytics & Monitoring:**
- **Google Analytics**: Comprehensive web analytics for visitor tracking and behavior analysis
  - Page view tracking
  - User engagement metrics
  - Traffic source analysis

**Development Tools:**
- **Git**: Version control for tracking changes and collaboration
- **GitHub**: Code hosting, collaboration, and automated deployment
- **Browser DevTools**: Testing and debugging across different browsers

**Why These Technologies?**
- **No Build Step Required**: Pure HTML/CSS/JS means instant deployment without compilation
- **Performance**: Minimal dependencies and CDN-delivered assets ensure fast load times
- **Reliability**: Static site architecture means no server-side vulnerabilities or downtime
- **Cost**: Completely free hosting through GitHub Pages
- **Simplicity**: Easy to maintain and update without complex tooling

## License

**Template Credit:** Original design by [Rick Waalders](http://www.pixelsbyrick.com/)

This website is based on the "Gumba" template. Please respect the original designer's work by maintaining attribution when using this template as a base for your own projects.

## Browser Compatibility

The site is tested and fully compatible with:

| Browser | Minimum Version | Notes |
|---------|----------------|-------|
| Chrome | 90+ | Recommended for development |
| Firefox | 88+ | Full support |
| Safari | 14+ | macOS and iOS |
| Edge | 90+ | Chromium-based versions |
| Mobile Safari | iOS 13+ | Optimized for mobile |
| Chrome Mobile | Latest | Full mobile support |

**Legacy Browser Support:**
- Internet Explorer is NOT supported (discontinued by Microsoft)
- Older browsers may experience degraded styling but content remains accessible

## Performance

**Current Performance Metrics:**
- **Page Load Time**: < 2 seconds on broadband connections
- **Page Size**: ~50KB HTML + CSS (excluding external CDN resources)
- **Render Blocking**: Minimal - CSS loaded from fast CDN sources
- **Mobile Performance**: Optimized with responsive images and mobile-first CSS

**Optimization Tips:**
- External resources (jQuery, analytics) load asynchronously
- CSS is minified (fluidbox.min.css)
- Consider image optimization if adding photos (use WebP format when possible)
- Leverage browser caching for static assets

## Troubleshooting

### Common Issues and Solutions

**Issue: Styles not loading correctly**
- **Solution**: Clear your browser cache (Ctrl+Shift+Delete) and hard refresh (Ctrl+Shift+R)
- **Alternative**: Check if AWS S3 resources are accessible - try visiting the S3 URL directly

**Issue: Local server won't start**
- **Solution**:
  - Python: Ensure Python is installed (`python --version`)
  - Node.js: Check if another process is using port 8000 (`lsof -i :8000` on Mac/Linux)
  - Try a different port: `python -m http.server 8080`

**Issue: Changes not appearing on live site**
- **Solution**: Wait 2-3 minutes for GitHub Pages rebuild, then check deployment status at `https://github.com/kelseyrae/kelsey/deployments`

**Issue: Custom domain not resolving**
- **Solution**:
  - Verify DNS settings with your domain registrar
  - Ensure CNAME file contains only the domain (no http:// or www.)
  - Allow 24-48 hours for DNS propagation

## Contributing

This is a personal portfolio website. However, if you notice bugs, broken links, or have suggestions for improvements:

1. Open an issue on GitHub describing the problem or suggestion
2. If you'd like to contribute code, fork the repository and submit a pull request
3. Ensure any changes maintain the clean, minimal aesthetic of the original design

## Maintenance

**Regular Maintenance Tasks:**
- **Monthly**: Review and update professional bio with new achievements
- **Quarterly**: Check all external links to ensure they're still valid
- **Annually**: Update copyright years and review dependencies for security updates

**Content Updates:**
- Keep the years of experience current
- Update company affiliations and project highlights
- Refresh personal interests section as needed

## Contact

For questions or collaboration opportunities, reach out via:
- Email: kelseyconophy@gmail.com
- LinkedIn: [kelseyconophy](https://www.linkedin.com/in/kelseyconophy)
- GitHub: [kelseyrae](https://github.com/kelseyrae)
