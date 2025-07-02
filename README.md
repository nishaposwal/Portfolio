# Nisha Poswal - Senior Angular Developer Portfolio

A modern, Netflix-style portfolio website built with Angular 17, showcasing comprehensive experience in warehouse management systems, gaming applications, and enterprise solutions.

## 🎬 Netflix-Style Experience

- **Interactive Intro**: Netflix-inspired logo animation with sound effects
- **Profile Selection**: Choose your viewing experience (Recruiter, Developer, Random)
- **Smooth Transitions**: Professional animations and transitions throughout
- **Dark Theme**: Elegant dark design with red accents (#e50914)

## 🚀 Key Features

### **Navigation & UX**
- **Responsive Hamburger Menu**: Mobile-optimized navigation with smooth animations
- **Active Route Highlighting**: Visual feedback for current page
- **Smooth Scrolling**: Enhanced user experience with scroll animations
- **Glassmorphism Effects**: Modern backdrop blur and transparency effects

### **Interactive Components**
- **Animated Project Cards**: Hover effects and staggered animations
- **Technology Tags**: Beautiful gradient badges with hover animations
- **Experience Timeline**: Interactive timeline with expandable details
- **Skills Visualization**: Dynamic skill bars and category organization

## 📋 Portfolio Sections

### **🏠 Home**
- Hero section with animated background
- Skills overview with progress indicators
- Professional introduction with call-to-action

### **💼 Experience**
- **Senior Software Engineer** at Solvei8 (2024 - Present)
  - Warehouse Management Systems for apparel manufacturing
  - 16+ specialized modules developed
  - Real-time inventory tracking with 85% error reduction
  
- **Software Developer Engineer** at Reliance Jio (2020 - 2024)
  - 20+ interactive games and entertainment applications
  - Real-time multiplayer features with Socket.IO
  - Payment gateway integration and wallet systems

### **🛠️ Projects Showcase**
- **Enterprise Solutions** (16 projects):
  - Warehouse Management System (Angular, Node.js, MongoDB, Ngrx)
  - Order Management System (Angular, TypeScript, RxJS, Bootstrap)
  - Quality Check Application (Angular, Material UI, FormsModule)
  - Process Mapping System (Angular, D3.js, REST API)
  - Tag Generation System (Angular, Barcode/QR Library)
  - Counting Application (Angular, RxJS, Bootstrap)
  - Fabric & Trims Inspection (Angular, Chart.js, Reactive Forms)

- **Gaming Applications** (12 projects):
  - Candy Crush Game (Angular, TypeScript, CSS Animations)
  - Ludo Game (Angular, Socket.IO, Node.js)
  - Fantasy Cricket (Angular, MongoDB, REST API)
  - Spin the Wheel Game (Angular, CSS Animations, RxJS)
  - Jackpot Game (Angular, RxJS, CSS Animations)
  - Tambola Game (Angular, Socket.IO, Node.js)
  - Sticker Chat for Live Cricket (Angular, Socket.IO, MongoDB)
  - Play & Win Mini Games (Angular, Node.js, RxJS)
  - Coupon Distribution System (Angular, JWT, MongoDB)

### **🎯 Skills**
- **Frontend**: Angular 17, TypeScript, RxJS, Ngrx, React
- **Backend**: Node.js, Express.js, MongoDB
- **Real-time**: Socket.IO, WebSocket
- **UI/UX**: SCSS, CSS Animations, Material UI, Bootstrap
- **Tools**: Git, REST API, JWT, Chart.js, D3.js

### **👤 About**
- Personal background and values
- Technical expertise overview
- Professional achievements and certifications

### **📞 Contact**
- Contact form with validation
- Social media links
- Professional networking information

## 🛠️ Technology Stack

### **Frontend Framework**
- **Angular 17**: Latest version with standalone components
- **TypeScript**: Strict typing and modern JavaScript features
- **SCSS**: Advanced CSS with variables and mixins

### **State Management & Data**
- **Ngrx**: Enterprise state management
- **RxJS**: Reactive programming and observables
- **Socket.IO**: Real-time bidirectional communication

### **Backend & Database**
- **Node.js**: Server-side JavaScript runtime
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for scalable applications

### **UI/UX Libraries**
- **Material UI**: Google's Material Design components
- **Bootstrap**: Responsive CSS framework
- **Chart.js & D3.js**: Data visualization libraries
- **Font Awesome**: Icon library

### **Development Tools**
- **Angular CLI**: Command-line interface
- **Git**: Version control
- **REST API**: HTTP-based services
- **JWT**: Authentication and authorization

## 🚀 Getting Started

### Prerequisites
- Node.js (version 20.19 or higher)
- npm (comes with Node.js)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Portfolio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

4. **Open your browser** and navigate to `http://localhost:4200`

## 📁 Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── home/           # Landing page with hero section
│   │   ├── experience/     # Professional timeline
│   │   ├── projects/       # Portfolio showcase (28 projects)
│   │   ├── skills/         # Skills visualization
│   │   ├── about/          # Personal information
│   │   └── contact/        # Contact form and social links
│   ├── app.component.ts    # Main app with Netflix intro
│   ├── app.routes.ts       # Routing configuration
│   └── app.config.ts       # App configuration
├── assets/
│   ├── images/             # Project screenshots and icons
│   └── sounds/             # Audio files for intro
├── styles.scss             # Global styles and variables
├── main.ts                 # Application entry point
└── index.html              # Main HTML file
```

## 🎨 Design System

### **Color Palette**
- **Primary Red**: `#e50914` (Netflix red)
- **Secondary Red**: `#ff6b6b` (Accent color)
- **Background**: Dark gradients and glassmorphism
- **Text**: White and light grays for readability

### **Typography**
- **Primary Font**: Inter (Google Fonts)
- **Icons**: Font Awesome
- **Responsive**: Scalable font sizes

### **Animations**
- **CSS Transitions**: Smooth hover effects
- **Keyframe Animations**: Netflix intro and page transitions
- **Staggered Animations**: Project cards and timeline items

## 📱 Responsive Design

### **Breakpoints**
- **Mobile**: < 768px (Hamburger menu, stacked layouts)
- **Tablet**: 768px - 1024px (Adaptive grid layouts)
- **Desktop**: > 1024px (Full navigation, multi-column layouts)

### **Mobile Features**
- **Hamburger Menu**: Animated toggle with full-screen overlay
- **Touch Optimized**: Large touch targets and swipe gestures
- **Performance**: Optimized animations for mobile devices

## 🚀 Deployment

### **Build for Production**
```bash
npm run build
```

### **Deployment Options**

#### **Netlify**
1. Build the project: `npm run build`
2. Upload the `dist/Portfolio` folder to Netlify
3. Configure custom domain and SSL

#### **Vercel**
1. Connect your GitHub repository to Vercel
2. Vercel auto-detects Angular and builds the project
3. Automatic deployments on push to main branch

#### **Firebase Hosting**
1. Install Firebase CLI: `npm install -g firebase-tools`
2. Initialize Firebase: `firebase init hosting`
3. Build and deploy: `npm run build && firebase deploy`

## 🔧 Available Scripts

- `npm start` - Start development server with hot reload
- `npm run build` - Build for production with optimization
- `npm run test` - Run unit tests with Karma
- `npm run watch` - Build and watch for changes
- `npm run lint` - Run ESLint for code quality

## 📊 Performance Features

- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: WebP format and responsive images
- **CSS Optimization**: Purged unused styles in production
- **Bundle Optimization**: Tree shaking and minification

## 🔒 Security Features

- **Content Security Policy**: XSS protection
- **HTTPS Only**: Secure connections in production
- **Input Validation**: Form validation and sanitization
- **JWT Authentication**: Secure token-based authentication

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Contact & Social

- **Email**: nishaposwal321@gmail.com
- **GitHub**: [nishaposwal](https://github.com/nishaposwal)
- **LinkedIn**: [nisha-poswal](https://linkedin.com/in/nisha-poswal)
- **Portfolio**: [Live Demo](https://your-portfolio-url.com)

## 🏆 Achievements

- **16+ Enterprise Modules**: Warehouse management and production systems
- **12+ Gaming Applications**: Interactive multiplayer games
- **1000+ Daily Users**: Solutions serving manufacturing and gaming industries
- **8+ Systems Integrated**: Seamless enterprise system integration
- **98% Performance Rating**: High-quality, optimized applications

---

**Built with ❤️ using Angular 17, TypeScript, and modern web technologies**

*Experience the Netflix-style portfolio that showcases real-world enterprise solutions and gaming applications.* 