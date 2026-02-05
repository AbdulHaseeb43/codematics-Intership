🔗 Task 6 – Ahsan Portfolio - Personal Portfolio Website

🔗 📋 Project Overview
Task 6 is a modern, high-performance, and responsive personal portfolio website built with HTML and Tailwind CSS. The project features a seamless dark mode toggle, interactive elements, and a mobile-first design approach to showcase professional skills and work.

The objective was to create a clean, design-accurate interface that includes persistent theme settings and smooth navigation for a professional user experience.

🔗 ✨ Features
Fully responsive design for mobile, tablet, and desktop.

Theme Persistence: Dark/Light mode selection is saved in localStorage for a consistent experience.

Dynamic UI: Includes a mobile-friendly hamburger menu and professional navigation.

Comprehensive Sections: Covers Hero, About, Skills, Experience, Projects, Testimonials, and Contact.

Interactive UX: Copy-to-clipboard functionality for email and phone numbers.

Utility-first styling with Tailwind CSS.

🔗 🛠️ Technologies Used
HTML5 — Semantic markup.

Tailwind CSS — Utility-first styling.

JavaScript — Mobile menu interactivity and theme switching.

Dark Mode — System preference detection and manual toggle.

🔗 🛠️ Setup & Installation
🔗 Option 1: Simple Setup (No Build Required)
Clone or download this repository.

Open task6.html directly in any modern web browser.

🔗 Option 2: Development Setup (Customizing Tailwind)
If you wish to modify the Tailwind configuration and rebuild the CSS:

Install dependencies:

Bash
npm install -D tailwindcss
Initialize configuration:

Bash
npx tailwindcss init
Build the CSS:

JSON
"scripts": {
  "build-css": "tailwindcss -i ./src/input.css -o ./dist/tailwind.css --watch"
}

🔗 🎨 Customization
Personal Info: Update your name, location, and contact details in task6.html.

Images: Replace assets in images/images/ to update profile and project photos.

Breakpoints: The design transitions seamlessly at 768px (Tablet) and 1024px (Desktop).

🔗 👨‍💻 Author
ABDUL HASEEB

🔗 📝 License
This project is open source and available under the MIT License.
