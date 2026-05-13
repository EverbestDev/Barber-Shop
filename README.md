# Bazetwo Barbers Frontend

Premium grooming platform for the modern gentleman.

## Features
- **Booking System**: Seamless appointment scheduling with service selection and barber preference.
- **Payment Integration**: Secure payment processing via Stripe.
- **User Dashboard**: Personal profile, booking history, and notification management.
- **Admin Dashboard**: Comprehensive studio management, including user records, booking agendas, and transaction logs.
- **Barber Dashboard**: Specialized view for stylists to manage their daily schedules and client records.
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices.

## Tech Stack
- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: Vanilla CSS with [Framer Motion](https://www.framer.com/motion/) and [GSAP](https://gsap.com/) for animations.
- **Icons**: [Lucide React](https://lucide.dev/)
- **Payments**: [Stripe JS](https://stripe.com/docs/js)
- **Routing**: [React Router 7](https://reactrouter.com/)

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in the required environment variables:
   ```env
   VITE_API_URL=http://localhost:8000
   VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure
- `src/api`: API client and endpoint definitions.
- `src/components`: Reusable UI components (layout, common, sections).
- `src/context`: Authentication and global state management.
- `src/pages`: Application pages and route components.
- `src/utils`: Helper functions and utility constants.

## Contributing
Please follow the established coding standards and ensure TypeScript types are properly defined for all new features.
