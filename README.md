# BloodTracker

A web application for tracking blood test results, built with Vite + React, Firebase, and Shadcn UI.

## Features

- 🩺 Track blood test results through a multi-step form
- 📊 View test history and trends
- 📱 Mobile-first, responsive design
- 🔒 Secure authentication with Firebase
- 📄 Generate PDF reports of test results
- 🌓 Dark/Light mode support

## Tech Stack

- Vite + React
- TypeScript
- Firebase (Authentication & Firestore)
- Shadcn UI
- Tailwind CSS
- Radix UI
- React Router DOM
- React Hook Form with Zod validation

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 7.x or later
- A Firebase project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/blood-tracker.git
cd blood-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
VITE_FIREBASE_PROJECT_ID=your_project_id_here
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id_here
VITE_FIREBASE_APP_ID=your_app_id_here
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id_here
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

```bash
npm run build
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
