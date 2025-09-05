# AT&T NetBond SDCI - Cloud Connectivity Management Platform

[![CI/CD Pipeline](https://github.com/your-username/att-netbond-sdci/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/att-netbond-sdci/actions/workflows/ci.yml)
[![Deploy to GitHub Pages](https://github.com/your-username/att-netbond-sdci/actions/workflows/auto-deploy.yml/badge.svg)](https://github.com/your-username/att-netbond-sdci/actions/workflows/auto-deploy.yml)
[![Lighthouse Performance](https://github.com/your-username/att-netbond-sdci/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/your-username/att-netbond-sdci/actions/workflows/lighthouse.yml)

## Overview

AT&T NetBond SDCI (Software-Defined Cloud Interconnect) is a comprehensive cloud connectivity management platform that enables enterprises to establish secure, high-performance connections between their networks and major cloud service providers. This application provides a unified interface for managing, monitoring, and configuring network connections across multiple cloud environments.

## Key Features

### Connection Management
- **Multi-Cloud Support**: Connect to AWS, Azure, Google Cloud, and other providers
- **Connection Types**: Support for Internet to Cloud, Cloud Router, Direct Connect, and more
- **Visual Network Designer**: Interactive canvas for designing network topologies
- **Connection Wizard**: Step-by-step guided connection creation
- **API Integration**: Create connections programmatically via API

### Monitoring & Analytics
- **Real-time Metrics**: Monitor latency, packet loss, jitter, and bandwidth utilization
- **Performance Dashboard**: Comprehensive view of network health and performance
- **Alerts & Notifications**: Proactive notifications for performance issues
- **Historical Data**: Track performance trends over time
- **Custom Reports**: Generate tailored reports for specific metrics

### Control Center
- **Customizable Dashboard**: Drag-and-drop widgets for personalized monitoring
- **Widget Library**: Extensive collection of widgets for different metrics and functions
- **Layout Persistence**: Save and restore dashboard configurations

### Configuration & Administration
- **User Management**: Role-based access control for different user types
- **Pool Management**: Organize connections into logical pools
- **Billing Management**: Track costs and usage across connections
- **Policy Configuration**: Define and manage network policies
- **System Settings**: Configure global system preferences

### Security Features
- **End-to-End Encryption**: Secure data transmission
- **DDoS Protection**: Built-in protection against distributed denial-of-service attacks
- **Compliance Reporting**: Generate reports for security compliance
- **Access Control**: Fine-grained permissions for connection management

### Visualization Options
- **Grid View**: Card-based visualization of connections
- **List View**: Detailed tabular view with customizable columns
- **Topology View**: Network diagram visualization of connections

## Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: React Router v6
- **State Management**: Zustand for global state
- **UI Components**: Custom component library with Tailwind CSS
- **Charts & Visualization**: Chart.js with React-ChartJS-2
- **Icons**: Lucide React
- **Drag & Drop**: DND Kit for drag-and-drop functionality

### Accessibility
- **WCAG 2.1 AA Compliance**: 98% conformance
- **Section 508 Compliance**: 97% conformance
- **Keyboard Navigation**: Full keyboard support for all interactions
- **Screen Reader Support**: ARIA attributes and semantic HTML
- **Focus Management**: Proper focus trapping in modals and drawers

### Performance Optimizations
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Manual chunk splitting for vendor libraries
- **Responsive Design**: Optimized for all device sizes
- **Reduced Motion**: Respects user preferences for reduced motion

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/att/netbond.git

# Navigate to the project directory
cd netbond

# Install dependencies
npm install

# Start the development server
npm run dev
```

### Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run build:gh-pages` - Build for GitHub Pages deployment
- `npm run test` - Run tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:a11y` - Run accessibility tests
- `npm run lint` - Lint the codebase
- `npm run deploy` - Deploy to GitHub Pages (manual)

## Deployment

### Automatic Deployment
The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment URL will be:

```
https://your-username.github.io/att-netbond-sdci/
```

### Manual Deployment
To manually deploy to GitHub Pages:

```bash
npm run deploy
```

## CI/CD Pipeline

### Workflows
- **CI Pipeline** (`.github/workflows/ci.yml`): Runs tests, linting, and builds
- **Auto Deploy** (`.github/workflows/auto-deploy.yml`): Deploys to GitHub Pages
- **Code Quality** (`.github/workflows/code-quality.yml`): Advanced quality checks
- **Lighthouse Audit** (`.github/workflows/lighthouse.yml`): Performance monitoring
- **Sync** (`.github/workflows/sync.yml`): Syncs changes from external environments

### Quality Gates
- ✅ All tests must pass
- ✅ ESLint validation with zero errors
- ✅ TypeScript compilation without errors
- ✅ Accessibility compliance (WCAG 2.1 AA)
- ✅ Bundle size under 5MB
- ✅ Performance score above 80
- ✅ Security audit passing

## Project Structure

```
src/
├── components/         # UI components
│   ├── common/         # Reusable UI components
│   ├── connection/     # Connection-specific components
│   ├── control-center/ # Control center dashboard components
│   ├── pool/           # Pool management components
│   ├── pool-detail/    # Pool detail components
│   ├── monitoring/     # Monitoring and analytics components
│   ├── network-designer/ # Network topology designer
│   ├── navigation/     # Navigation components
│   ├── wizard/         # Connection creation wizard
│   └── ...
├── hooks/              # Custom React hooks
├── store/              # Zustand store and slices
│   └── slices/         # Store slices for different features
├── styles/             # Global styles and design tokens
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── ...
```

## Connection Creation Methods

The platform offers three different ways to create network connections:

1. **Step-by-Step Wizard**: A guided, user-friendly approach with detailed configuration options
2. **Visual Designer**: Interactive canvas for designing complex network topologies
3. **API Toolbox**: Advanced option for creating connections using JSON configuration and API endpoints

## Pool Management

Pools allow you to organize connections and users for easier management:

- **Pool Types**: Business, Department, Project, Team, and Custom
- **Pool Features**: Addresses, Contacts, Permissions, Billing, Performance metrics
- **Connection Management**: Associate connections with specific pools
- **Member Management**: Add users with different permission levels

## Monitoring Dashboard

The monitoring dashboard provides comprehensive visibility into your network:

- **Overview**: Summary of all connection metrics
- **Detailed Metrics**: In-depth performance analysis
- **Alerts**: Real-time notification of issues
- **Logs**: Comprehensive logging of events and activities
- **Network Analyzer**: Advanced tools for troubleshooting
- **Reports**: Generate and schedule detailed reports

## Customization

### Theme Customization
The application uses a design token system that can be customized in `src/styles/tokens.css`. This allows for consistent styling across the application while enabling easy theme changes.

### Widget Customization
The Control Center dashboard supports custom widgets that can be added to the `src/components/control-center/widgets/` directory.

## Accessibility

AT&T NetBond SDCI is designed with accessibility in mind, following WCAG 2.1 AA guidelines. Key features include:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management for modals and drawers
- Color contrast compliance
- Screen reader announcements for dynamic content

## Browser Support

- Chrome (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Edge (latest 2 versions)

## License

Copyright © 2025 AT&T Intellectual Property. All rights reserved.