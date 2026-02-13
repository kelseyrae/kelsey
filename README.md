# Kelsey Conophy - Personal Portfolio Website

This repository contains the source code for Kelsey Conophy's personal portfolio website, hosted at [www.kelseyconophy.com](http://www.kelseyconophy.com).

## Overview

A clean, minimal personal portfolio website showcasing professional experience, skills, and contact information. The site is built with simple HTML/CSS and uses the Semantic UI framework for styling components.

## Project Structure

```
kelsey/
├── index.html              # Main landing page
├── CNAME                   # Custom domain configuration
├── static-aws/             # Static assets
│   └── css/               # Custom stylesheets
│       ├── main.css       # Primary styles
│       └── fluidbox.min.css
├── Semantic-UI-master/     # Semantic UI framework (vendor)
└── README.md              # This file
```

## How It Works

This is a static website that:
- Displays professional background and experience
- Provides contact information and social links
- Uses a responsive design that works on mobile and desktop
- Loads CSS from both local files and AWS S3 bucket
- Includes Google Analytics for visitor tracking

## How to Run

### Local Development

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kelseyrae/kelsey.git
   cd kelsey
   ```

2. **Open in a browser:**

   Simply open `index.html` in your web browser:
   ```bash
   # On macOS
   open index.html

   # On Linux
   xdg-open index.html

   # On Windows
   start index.html
   ```

3. **Or use a local web server (recommended):**

   Using Python 3:
   ```bash
   python -m http.server 8000
   ```

   Then visit `http://localhost:8000` in your browser.

   Using Node.js (with http-server):
   ```bash
   npx http-server -p 8000
   ```

### Deployment

The site is hosted via GitHub Pages and uses the custom domain configured in the `CNAME` file.

**To deploy changes:**
1. Make your changes to `index.html` or CSS files
2. Commit and push to the main branch:
   ```bash
   git add .
   git commit -m "Update content"
   git push origin main
   ```
3. GitHub Pages will automatically deploy the changes

## Customization

### Updating Content

- **Name and title:** Edit the header section in `index.html` (lines 19-22)
- **Bio and experience:** Edit the intro section (lines 28-44)
- **Contact information:** Update the contact section (lines 46-59)
- **Styling:** Modify `static-aws/css/main.css` for visual changes

### External Dependencies

The site uses these external resources:
- Semantic UI framework (included in `Semantic-UI-master/`)
- jQuery (loaded from CDN)
- Google Analytics (UA-65972343-1)
- Fluidbox CSS (loaded from S3: `s3-us-west-2.amazonaws.com/kelseyconophy/`)

## Technologies Used

- HTML5
- CSS3
- JavaScript/jQuery
- Semantic UI Framework
- Google Analytics

## License

Template credit: Original design by [Rick Waalders](http://www.pixelsbyrick.com/)

## Contact

For questions or collaboration opportunities, reach out via:
- Email: kelseyconophy@gmail.com
- LinkedIn: [kelseyconophy](https://www.linkedin.com/in/kelseyconophy)
- GitHub: [kelseyrae](https://github.com/kelseyrae)
