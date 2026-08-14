# Crafted in Code

A refined editorial portfolio that blends thoughtful design, interactive motion, and handcrafted frontend development into a tactile digital experience.

##Live link
https://paperframe-red.vercel.app/


## Overview

**Crafted in Code** is a minimalist portfolio built around the idea of treating a website like a carefully designed piece of print.

The experience combines warm paper-inspired visuals, editorial typography, subtle interactions, scroll-driven motion, and an interactive project showcase.

## Features

* Editorial stationery-inspired visual system
* Responsive design for desktop, tablet, and mobile
* Scroll-driven project movement
* Interactive project showcase
* Self-drawing SVG demonstration
* Dynamic project variants
* Custom cursor interactions
* Animated typography
* Accessible interaction states
* `prefers-reduced-motion` support
* Lightweight static architecture
* No backend or database required

## Tech Stack

* HTML5
* CSS3
* Vanilla JavaScript
* GSAP
* ScrollTrigger
* Google Fonts

## Design Direction

The interface uses a restrained visual language:

* Warm paper backgrounds
* Deep ink typography
* Ink-blue accents
* Hairline borders
* Newsreader typography
* Courier Prime metadata
* Sharp rectangular geometry
* Minimal motion
* No gradients
* No excessive shadows
* No rounded cards

The goal is to make the website feel closer to an editorial publication than a conventional developer portfolio.

## Project Structure

```text
crafted-in-code/
│
├── index.html
├── style.css
├── script.js
└── README.md
```


## Customization

Project information can be customized directly inside the HTML and JavaScript files.

Replace:

* Project names
* Project descriptions
* GitHub links
* Images
* Technology information
* Contact links
* Portfolio statistics

No database or API configuration is required.

## Motion

The portfolio uses scroll position to control major visual transitions.

The featured project travels between sections rather than being duplicated throughout the page.

The SVG demonstration draws itself when it enters the viewport, creating a visual connection between the interface and the work being presented.

Motion is progressively reduced when the user has enabled `prefers-reduced-motion`.

## Performance

The project is designed as a lightweight static frontend.

There is:

* No backend
* No database
* No authentication
* No paid API
* No build dependency
* No GitHub API requirement

External libraries are loaded through free CDNs.

## License

This project is available for personal and educational use.

Built with HTML, CSS, JavaScript, and attention to detail.
