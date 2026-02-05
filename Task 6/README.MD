
🔗 Ahsan Portfolio - Personal Portfolio Website
A modern, high-performance, and responsive portfolio website built with HTML and Tailwind CSS. This project features a seamless dark mode toggle, interactive elements, and a mobile-first design approach.

🔗 🚀 Technologies Used
HTML5 — Semantic markup for SEO and accessibility.

Tailwind CSS — Utility-first CSS framework for rapid UI development.

JavaScript — Powers interactive features like the mobile menu and theme switching.

Dark Mode — Built-in support for light and dark themes with system preference detection.

Responsive Design — Fully optimized for Mobile, Tablet, and Desktop views.

🔗 ✨ Features
Theme Persistence: Dark/Light mode selection is saved in localStorage.

Dynamic UI: Includes a mobile-friendly hamburger menu and professional typography.

Comprehensive Sections: Covers Hero, About, Skills (16+ technologies), Experience, Projects, Testimonials, and Contact.

Interactive UX: Copy-to-clipboard functionality for contact details and smooth hover effects.

🔗 🛠️ Setup & Installation
🔗 Option 1: Simple Setup (No Build Required)
Clone or download this repository.

Open task6.html directly in any modern web browser.

🔗 Option 2: Development Setup (Customizing Tailwind)
If you wish to modify the Tailwind configuration and rebuild the CSS:

Install dependencies:

Bash
npm install -D tailwindcss
Initialize Tailwind configuration:

Bash
npx tailwindcss init
Add the build script to your package.json:

JSON
"scripts": {
  "build-css": "tailwindcss -i ./src/input.css -o ./dist/tailwind.css --watch"
}
Compile the CSS:

Bash
npm run build-css
🔗 🎨 Customization
Personal Info: Update your name (Line 65), Location (Line 76), and Contact info (Lines 615-622) in task6.html.

Images: Replace assets in images/images/ using the same file names to update photos automatically.

Breakpoints: The design transitions at 768px (Tablet) and 1024px (Desktop).

🔗 👨‍💻 Author
Abdul Haseeb

🔗 📝 License
This project is open source and available under the MIT License.
