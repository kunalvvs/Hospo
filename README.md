# Hospo Healthcare App

A modern, responsive healthcare application built with React.js and Vite featuring role-based authentication.

## Features

- **Role Selection Screen**: Choose between Doctor, Chemist, or Patient
- **Role-based Login**: Login page that adapts based on selected role
- **Modern UI**: Clean, professional design with smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **LocalStorage Integration**: Saves user role for seamless navigation
- **⚡ Vite**: Lightning-fast HMR (Hot Module Replacement) for instant updates

## Tech Stack

- React.js 18
- React Router v6
- Vite 5 (Build tool - super fast!)
- CSS3 (with animations and gradients)
- LocalStorage API

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Structure

```
src/
├── pages/
│   ├── RoleSelection.jsx    # Role selection screen
│   ├── RoleSelection.css    # Role selection styles
│   ├── Login.jsx            # Login page
│   └── Login.css            # Login page styles
├── App.jsx                  # Main app component with routing
├── App.css                  # App styles
├── index.js                 # Entry point
└── index.css                # Global styles
```

## Features Explained

### Role Selection Page
- Three interactive cards for Doctor, Chemist, and Patient roles
- Smooth hover effects with scale and shadow animations
- Icon-based visual representation
- Saves selected role to localStorage
- Automatic navigation to login page

### Login Page
- Dynamic role badge showing selected role
- Mobile number input with validation
- Consistent with Hospo branding
- Option to go back and change role
- Responsive design for all screen sizes

## Customization

### Colors
The app uses a purple gradient theme. To change colors, modify:
- Background gradients in CSS files
- Button colors in `.continue-btn` class
- Card hover effects

### Icons
Currently using emoji icons. To use custom icons:
1. Install an icon library (e.g., react-icons)
2. Replace emoji in the `roles` array in `RoleSelection.jsx`

### API Integration
To connect to a backend:
1. Add axios or fetch calls in `handleContinue` function in `Login.jsx`
2. Implement OTP verification flow
3. Add authentication token management

## Available Scripts

- `npm run dev` - Runs the app in development mode with Vite (⚡ super fast!)
- `npm run build` - Builds the app for production
- `npm run preview` - Preview the production build locally

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
