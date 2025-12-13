# Hospo Healthcare App

A modern, comprehensive healthcare platform built with React.js and Node.js featuring role-based authentication, ambulance management, and multi-profile support.

## 🎉 Latest Updates (January 2025)

### Ambulance Dashboard Restructuring - COMPLETED ✅

**Major improvements to the Ambulance Provider Dashboard:**

- ✅ **Merged Sections**: Driver information (Personal + KYC + Qualifications) consolidated into single "Driver Management" section
- ✅ **Multiple Profiles**: Support for unlimited driver profiles and vehicle profiles per ambulance
- ✅ **Modern UI**: Card-based interface with Add/Edit/Delete operations
- ✅ **CRUD Operations**: Full Create, Read, Update, Delete functionality for drivers and vehicles
- ✅ **Responsive Design**: Mobile-first approach with grid layouts
- ✅ **Backend Ready**: Complete API with sub-document arrays and migration helpers

**What's New:**
- Navigation menu reduced from 11 to 7 items (cleaner UX)
- Profile cards show comprehensive information at a glance
- Edit forms combine all related fields (70+ for drivers, 80+ for vehicles)
- Old sections (KYC, Qualifications, Documents, Equipment) redirect to merged parents
- Backward compatible with existing data

**See Full Details:**
- [RESTRUCTURING_COMPLETE_SUMMARY.md](./RESTRUCTURING_COMPLETE_SUMMARY.md) - Complete technical documentation
- [TESTING_GUIDE.md](./TESTING_GUIDE.md) - Step-by-step testing procedures

---

## Features

- **Role Selection Screen**: Choose between Doctor, Hospital, Ambulance, Chemist, Pathlab, or Patient
- **Role-based Login**: Secure authentication with JWT tokens
- **Comprehensive Dashboards**: 
  - **Ambulance Dashboard**: Multi-driver profiles, vehicle management, equipment tracking, pricing, operations
  - **Doctor Dashboard**: Profile management, appointments, patient records
  - **Hospital Dashboard**: Staff management, departments, facilities
  - **Chemist/Pathlab Dashboards**: Inventory, orders, reports
- **Modern UI**: Clean, professional design with smooth animations and gradients
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **File Uploads**: Cloudinary integration for document management
- **Real-time Updates**: Instant UI refresh after data changes
- **⚡ Vite**: Lightning-fast HMR (Hot Module Replacement) for instant development updates

## Tech Stack

### Frontend:
- React.js 18
- React Router v6
- Axios (API client)
- Vite 5 (Build tool)
- CSS3 (with animations, gradients, and responsive design)

### Backend:
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt (password hashing)
- Cloudinary (file storage)
- Nodemailer (email notifications)

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
