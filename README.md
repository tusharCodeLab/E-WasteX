# E-Waste Management Platform

A comprehensive electronic waste management platform built with Next.js 15, featuring user authentication, marketplace functionality, and environmental impact tracking.

## 👥 Project Authors

This project is designed, developed, and maintained by:

- **Tushar Patoliya**  
  Computer Engineering Undergraduate | Full-Stack Developer  
  Focused on scalable web systems, modern UI/UX, and sustainable technology solutions.

- **Harsh Jasani**  
  Computer Engineering Undergraduate | Software Developer  
  Specializing in backend systems, databases, and application architecture.

---

## 🌟 Features

### Core Functionality
- **User Management**: Multi-role system (Seller, Buyer, Admin)
- **E-Waste Marketplace**: Buy and sell electronic waste items
- **Authentication**: Secure JWT-based authentication with Better Auth
- **Real-time Chat**: Messaging system between users
- **Location Services**: Google Maps integration for location-based services
- **Impact Calculator**: Environmental impact tracking and statistics
- **Admin Dashboard**: Comprehensive admin panel with analytics
- **Payment Integration**: Stripe payment processing

### User Roles
- **Sellers**: List e-waste items, manage inventory, track sales
- **Buyers**: Browse listings, make purchases, manage interests
- **Admins**: Platform oversight, user management, analytics

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **3D Visualizations**: Three.js integration for interactive elements
- **Real-time Updates**: Live data synchronization
- **File Upload**: Drag-and-drop file handling with React Dropzone
- **Charts & Analytics**: Data visualization with Recharts
- **Modern UI Components**: Radix UI and Shadcn/ui components

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15.3.6 with App Router
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 with custom animations
- **UI Components**: 
  - Radix UI primitives
  - Shadcn/ui components
  - Headless UI
  - Lucide React icons
- **Animations**: Framer Motion, TSParticles
- **3D Graphics**: Three.js, React Three Fiber, React Three Drei
- **Maps**: Google Maps API integration

### Backend & Database
- **Database**: MongoDB with Mongoose ODM
- **ORM Alternative**: Drizzle ORM with LibSQL support
- **Authentication**: Better Auth with JWT
- **File Storage**: Built-in file handling
- **Payment**: Stripe integration

### Development Tools
- **Build Tool**: Turbopack (Next.js)
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript with strict mode
- **Package Manager**: npm/bun support

## 📋 Prerequisites

- Node.js 18+ or Bun
- MongoDB database
- Google Maps API key (for location services)
- Stripe account (for payments)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd e-waste
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   # or
   bun install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/e-waste-management
   
   # Authentication
   JWT_SECRET=your_jwt_secret_key_here
   BETTER_AUTH_SECRET=your_better_auth_secret
   
   # Google Maps (optional)
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
   
   # Stripe (optional)
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   
   # App Configuration
   NEXTAUTH_URL=http://localhost:3000
   NODE_ENV=development
   ```

4. **Database Setup**
   
   Ensure your MongoDB database is running and accessible. The application will automatically create the necessary collections on first run.

## 🚀 Running the Application

### Development Mode
```bash
npm run dev
# or
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
```bash
npm run build
npm start
# or
bun run build
bun start
```

### Linting
```bash
npm run lint
```

## 📁 Project Structure

```
e-waste/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── listings/      # Marketplace API
│   │   │   ├── messages/      # Chat system API
│   │   │   └── stats/         # Analytics API
│   │   ├── buyer/             # Buyer dashboard
│   │   ├── dashboard/         # User dashboard
│   │   ├── login/             # Authentication pages
│   │   ├── profile/           # User profiles
│   │   ├── register/          # User registration
│   │   └── seller/            # Seller dashboard
│   ├── components/            # Reusable components
│   │   ├── ui/               # UI component library
│   │   ├── AuthContext.tsx   # Authentication context
│   │   ├── Chat.tsx          # Chat functionality
│   │   ├── ImpactCalculator.tsx # Environmental impact
│   │   ├── LocationPicker.tsx # Location services
│   │   └── Navbar.tsx        # Navigation
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── auth.ts          # Authentication utilities
│   │   ├── database.ts      # Database connection
│   │   └── utils.ts         # General utilities
│   ├── models/              # Database models
│   │   ├── User.ts          # User model
│   │   ├── Listing.ts       # Marketplace listing model
│   │   ├── Message.ts       # Chat message model
│   │   └── Interest.ts      # User interest model
│   └── visual-edits/        # Visual editing components
├── public/                  # Static assets
├── .env.local              # Environment variables
├── components.json         # Shadcn/ui configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind CSS configuration
└── tsconfig.json          # TypeScript configuration
```

## 🔧 Configuration

### Tailwind CSS
The project uses Tailwind CSS 4 with custom configurations:
- Custom color schemes
- Animation utilities
- Component-specific styles
- Responsive design breakpoints

### Next.js Configuration
- Turbopack for faster builds
- Image optimization for all domains
- TypeScript and ESLint error handling
- Custom loader for visual editing

### Database Models
- **User**: Authentication and profile management
- **Listing**: E-waste marketplace items
- **Message**: Real-time chat system
- **Interest**: User engagement tracking

## 🔐 Authentication

The platform uses Better Auth for secure authentication:
- JWT token-based sessions
- Multi-role user system
- Password hashing with bcrypt
- Session management

### User Roles
1. **Seller**: Can create and manage listings
2. **Buyer**: Can browse and purchase items
3. **Admin**: Full platform access and management

## 🗄️ Database Schema

### User Collection
```typescript
{
  name: string,
  email: string (unique),
  password: string (hashed),
  role: 'seller' | 'buyer' | 'admin',
  bio?: string,
  company?: string,
  location?: string,
  phone?: string,
  website?: string,
  createdAt: Date
}
```

### Additional Collections
- **Listings**: E-waste items for sale
- **Messages**: Chat communications
- **Interests**: User engagement data

## 🎨 UI Components

The project includes a comprehensive UI library:
- **Form Components**: Input, Select, Checkbox, Radio
- **Navigation**: Menubar, Breadcrumb, Pagination
- **Feedback**: Alert, Toast, Progress
- **Layout**: Card, Separator, Tabs, Accordion
- **Overlay**: Dialog, Popover, Tooltip, Sheet

## 📱 Responsive Design

- Mobile-first approach
- Breakpoint-specific layouts
- Touch-friendly interactions
- Optimized performance across devices

## 🔍 SEO & Performance

- Server-side rendering with Next.js
- Optimized images and assets
- Meta tag management
- Core Web Vitals optimization

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Manual Deployment
1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Configure reverse proxy (nginx/Apache)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- Dependency conflicts between `autumn-js` and `better-auth` (resolved with `--legacy-peer-deps`)
- Security vulnerabilities in Next.js 15.3.6 (upgrade recommended)

## 📞 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v0.1.0**: Initial release with core functionality
- Authentication system
- Marketplace features
- Admin dashboard
- Real-time chat

## 🎯 Future Roadmap

- [ ] Mobile application
- [ ] Advanced analytics
- [ ] AI-powered recommendations
- [ ] Blockchain integration
- [ ] Multi-language support
- [ ] Advanced search filters
- [ ] Notification system
- [ ] API documentation

---

**Built with ❤️ for sustainable e-waste management**

