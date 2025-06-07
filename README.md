# MediaHand - AI-Powered Business Management Platform

> A comprehensive business management platform designed for photographers and videographers, featuring AI-powered content creation and intelligent client management.

## 🚀 Project Overview

MediaHand is being developed as a unified platform that addresses the complex needs of visual content creators by providing:

- **Client Intelligence System**: Comprehensive client profiles that inform all business processes
- **AI-Powered Content Generation**: Creates on-brand content based on client attributes and preferences
- **All-in-One Business Management**: Unified workflows for appointments, projects, and finances
- **Modern Tech Stack**: Built with Astro, React, TypeScript, and Supabase for maximum performance

## 🛠️ Technical Stack

- **Frontend**: Astro 5.6.2 + React 18 + TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui based component library
- **Backend**: Supabase (Authentication, Database, Storage)
- **Deployment**: Node.js adapter for server-side rendering

## 📋 Current Status

### ✅ Completed Features
- **Foundation Setup** (100%)
  - Project infrastructure and build pipeline
  - Tailwind CSS with custom design system
  - Component library with shadcn/ui foundation
  - Responsive layout system

- **UI Components** (100%)
  - Core components (Button, Card, Input, etc.)
  - Navigation structure
  - Dashboard layout foundation
  - Theme system support

- **Authentication & Database** (60%)
  - ✅ Supabase integration setup and configuration
  - ✅ Complete database schema with all core tables
  - ✅ TypeScript types generated for database
  - ✅ Login/register page structure  
  - ✅ Basic auth API endpoints
  - ✅ Client service utilities with type safety
  - [ ] Email verification and password reset
  - [ ] MFA implementation

### 🚧 In Development
- Complete authentication flow
- Client management system
- Database schema design
- Form validation and error handling

### 📅 Next Priorities
1. **Complete Authentication System**
   - Email verification
   - Password reset functionality
   - User profile management
   - Role-based permissions

2. **Client Management Core**
   - Client profile creation and editing
   - Client search and filtering
   - Business categorization system

3. **AI Content Generation**
   - OpenAI API integration
   - Prompt engineering system
   - Content template management

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mediahand
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file with:
   ```env
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Open [http://localhost:4321](http://localhost:4321)
   - Navigate to `/login` or `/register` to test authentication

## 📖 Development Guide

### Project Structure
```
src/
├── app/                    # Next.js pages (dashboard)
├── components/
│   ├── ui/                # Reusable UI components
│   └── providers/         # Context providers (theme, etc.)
├── layouts/               # Page layouts
├── lib/                   # Utilities and configurations
├── pages/                 # Astro pages
│   ├── api/              # API endpoints
│   ├── clients/          # Client management pages
│   ├── projects/         # Project management pages
│   └── *.astro           # Individual pages
└── styles/               # Global styles
```

### Key Technologies
- **Astro**: Meta-framework for static site generation with islands architecture
- **React**: Component library for interactive UI elements
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Supabase**: Backend-as-a-Service for auth, database, and storage

### Development Workflow
1. **Pages**: Create new pages in `src/pages/` using Astro
2. **Components**: Build reusable components in `src/components/ui/`
3. **API**: Add API endpoints in `src/pages/api/`
4. **Styling**: Use Tailwind CSS with custom design system
5. **Types**: Add TypeScript interfaces in relevant component files

## 📚 Documentation

- **[Development Roadmap](./DEVELOPMENT_ROADMAP.md)** - Complete 40-week development plan
- **[Product Requirements](./# MediaHand_ Product Requirements Document.md)** - Original product vision and requirements
- **[Tasks Tracking](./tasks.md)** - Current task progress and checklist

## 🎯 Key Features (Planned)

### Client Management
- Comprehensive client profiles with business intelligence
- Brand guidelines and content preferences storage
- Client relationship scoring and analytics
- Automated client onboarding workflows

### AI Content Creation
- Context-aware content generation based on client profiles
- Platform-specific formatting (Instagram, Facebook, LinkedIn, TikTok)
- Tone and style customization per client
- Content performance tracking and optimization

### Project Management
- Visual project timelines and milestone tracking
- Task management with team collaboration
- Time tracking and profitability analysis
- Client approval workflows

### Business Operations
- Appointment scheduling with calendar integration
- Invoice generation and payment tracking
- Financial reporting and analytics
- Automated workflow management

## 🤝 Contributing

1. **Follow the existing code structure and patterns**
2. **Use TypeScript for type safety**
3. **Implement responsive design with Tailwind CSS**
4. **Add proper error handling and validation**
5. **Update documentation when adding new features**

## 🔐 Environment Setup

Required environment variables:
```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI (for future AI features)
OPENAI_API_KEY=your_openai_api_key

# Application Settings
NODE_ENV=development
```

## 📞 Support

For development questions or issues:
1. Check the [Development Roadmap](./DEVELOPMENT_ROADMAP.md) for planned features
2. Review the [Tasks](./tasks.md) file for current progress
3. Create an issue for bugs or feature requests

---

**Status**: Active Development | **Version**: 0.1.0 | **Last Updated**: January 2025 