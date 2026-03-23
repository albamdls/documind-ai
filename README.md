# DocuMind AI

> Intelligent document management platform with AI-powered assistance

Organize, manage, and interact with your documents using intelligent AI-powered chat. Complete workspace solution with authentication, notes, and modern responsive design.

![Logo](public/logo.svg)

## ✨ Features

- **📁 Workspace Management** - Create and organize multiple workspaces for different projects
- **📄 Document Management** - Upload, store, and organize documents efficiently
- **💬 AI Chat Assistant** - Intelligent chat assistance for document interaction
- **📝 Notes** - Create and manage notes alongside your documents
- **👤 User Authentication** - Secure login and registration system
- **🎨 Theme Support** - Dark and light theme modes
- **📱 Responsive Design** - Works seamlessly on desktop and mobile devices
- **⚡ Fast Performance** - Built with React and Vite for optimal speed

## 🚀 Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **State Management:** React Context API

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository**
```bash
git clone https://github.com/albamdls/documind-ai.git
cd documind-ai
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
documind-ai/
├── public/                 # Static assets
│   └── logo.svg           # Brand logo
├── src/
│   ├── components/        # Reusable components
│   │   ├── chat/          # Chat components
│   │   ├── documents/     # Document upload components
│   │   ├── layout/        # Layout components (Sidebar, Topbar)
│   │   └── ui/            # UI components
│   ├── context/           # React Context (Auth, Theme)
│   ├── data/              # Mock data
│   ├── layouts/           # Page layouts
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Project dependencies
```

## 📖 Usage

### Development

Run the development server with hot reload:
```bash
npm run dev
```

### Build

Create a production build:
```bash
npm run build
```

### Preview

Preview the production build locally:
```bash
npm run preview
```

## 🔑 Key Pages

- **Landing Page** (`/`) - Welcome page with feature showcase
- **Login** (`/login`) - User authentication
- **Register** (`/register`) - New user registration
- **Dashboard** (`/dashboard`) - Main dashboard view
- **Workspaces** (`/workspaces`) - Manage workspaces
- **Workspace Detail** (`/workspaces/:id`) - View workspace details
- **Documents** (`/documents/:id`) - View and interact with documents
- **Notes** (`/notes`) - Manage your notes
- **Settings** (`/settings`) - User settings and preferences

## 🎨 Theme System

The application supports dark and light themes with the following CSS variables:

- `--bg-base` - Background color
- `--txt-primary` - Primary text color
- `--accent` - Primary accent color
- `--accent-2` - Secondary accent color
- `--border-faint` - Border color

## 🔐 Authentication

User authentication is handled through the `AuthContext` provider. The app includes:
- Login and registration flows
- Protected routes
- User session management
- Logout functionality

## 🛠️ Development Tips

- Use `Sidebar` and `Topbar` components as layout wrappers
- Theme colors are controlled via CSS variables in `ThemeContext`
- Animations use Framer Motion for smooth transitions
- Icons are from Lucide React library
- Mock data available in `src/data/mockData.js`

## 📝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👤 Author

- **Alba Mandy López Salgado** ([@albamdls](https://github.com/albamdls))

## 🌐 Links

- [GitHub Repository](https://github.com/albamdls/documind-ai)
- [Issues](https://github.com/albamdls/documind-ai/issues)

---

Built with ❤️ by Alba Mandy López Salgado
