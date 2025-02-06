# BloodTracker

A web application for tracking blood test results, built with React, Vite, and Firebase.

## Features

- Multi-step form for blood test data entry
- Secure user authentication
- Mobile-first, responsive design
- PDF report generation
- Test history tracking
- Real-time data synchronization

## Tech Stack

- React + Vite
- TypeScript
- Firebase (Authentication & Firestore)
- Shadcn UI
- Tailwind CSS
- jsPDF for PDF generation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/blood-tracker.git
cd blood-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

4. Start the development server:
```bash
npm run dev
```

## Building for Production

```bash
npm run build
```

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
