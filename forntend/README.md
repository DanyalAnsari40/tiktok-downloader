# Video Downloader Frontend

A modern React application for downloading videos from TikTok and Instagram platforms.

## Features

- 🎵 **TikTok Downloads** - Download TikTok videos without watermarks
- 📷 **Instagram Downloads** - Download Instagram posts, reels, and stories
- 🔐 **User Authentication** - Secure login and registration system
- 📊 **Download History** - Track all your downloads
- 🎨 **Modern UI** - Beautiful, responsive design with animations
- 📱 **Mobile Friendly** - Works perfectly on all devices

## Tech Stack

- **React 19** - Latest React with hooks
- **React Router** - Client-side routing
- **Framer Motion** - Smooth animations
- **Axios** - HTTP client for API calls
- **CSS** - Clean and simple styling with CSS custom properties
- **Vite** - Fast build tool and dev server

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Backend server running (see backend README)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Download/       # Download-related components
│   ├── Layout/         # Header, Footer, etc.
│   └── UI/             # Basic UI components (Button, Loader)
├── context/            # React Context providers
├── pages/              # Page components
├── services/           # API service functions
├── styles/             # SCSS stylesheets
└── assets/             # Static assets
```

## Key Components

### Authentication
- **Login/Register** - User authentication forms
- **AuthContext** - Global authentication state management
- **Protected Routes** - Secure access to dashboard

### Download System
- **DownloadForm** - Video URL input and platform selection
- **DownloadHistory** - Display user's download history
- **DownloadContext** - Global download state management

### UI Components
- **Button** - Reusable button with variants
- **Loader** - Loading spinner component
- **Header/Footer** - Layout components

## API Integration

The frontend communicates with the backend API through service functions:

- `auth.js` - Authentication API calls
- `download.js` - Download API calls
- `api.js` - Base API configuration with interceptors

## Styling

The application uses CSS with:
- CSS custom properties for theming
- Responsive design with mobile-first approach
- Smooth animations and transitions
- Modern card-based layout

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
