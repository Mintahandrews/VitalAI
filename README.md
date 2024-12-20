# VitalAI - Your Personal Health & Wellness AI Assistant

![VitalAI Logo](src/assets/logo.png)

VitalAI is an innovative open-source health and wellness platform that combines artificial intelligence with personalized health tracking to help users achieve their wellness goals. Built with React, TypeScript, and Supabase, it offers a modern, secure, and user-friendly experience for managing your health journey.

## Features

- **AI-Powered Health Assistant**: Get personalized health recommendations and insights
- **Health Metrics Tracking**: Monitor sleep, steps, calories, water intake, and more
- **Goal Setting & Progress**: Set and track your health and fitness goals
- **Mindfulness Integration**: Access guided meditation and wellness exercises
- **Responsive Design**: Beautiful UI that works seamlessly across all devices
- **Secure Data Storage**: End-to-end encryption for your health data

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/mintahandrews/VitalAI.git
   cd VitalAI
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Update the `.env` file with your Supabase credentials.

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Tech Stack

- **Frontend**: React, TypeScript, Vite
- **UI Components**: Tailwind CSS, Lucide Icons
- **State Management**: React Context
- **Backend**: Supabase
- **Authentication**: Supabase Auth
- **Database**: PostgreSQL (via Supabase)

## Project Structure

```
VitalAI/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React context providers
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API and service integrations
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── public/            # Static assets
└── tests/            # Test files
```

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to submit pull requests, report issues, and contribute to the project.

## Development

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Authors

- **Andrews Mintah** - *Initial work* - [mintahandrews](https://github.com/mintahandrews)
  - Software Engineer
  - Health & Wellness Enthusiast
  - Open Source Contributor

## Acknowledgments

- Thanks to all contributors who help improve VitalAI
- Special thanks to the React and Supabase communities
- Inspired by the need for accessible health technology

## Support

If you find this project helpful, please consider giving it a ⭐️ on GitHub!
