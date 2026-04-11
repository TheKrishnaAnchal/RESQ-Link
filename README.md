# RESQ-LINK | AI-Powered Emergency Response System

RESQ-LINK is a high-performance, mobile-first emergency SOS and incident reporting platform. Built with Next.js, Genkit, and Mappls (MapmyIndia) APIs, it provides real-time AI-driven dispatch optimization for critical situations.

## 🚀 Features

- **One-Touch SOS**: High-stakes hold-to-activate trigger with haptic feedback.
- **AI Dispatch Agent**: Intelligent responder selection using Mappls Distance Matrix and Routing.
- **Incident Analysis**: Natural language incident classification using Genkit AI.
- **Agency Directory**: Real-time discovery of nearby hospitals, fire stations, and police precincts.
- **Modern UI**: Dark-mode glassmorphic interface designed for clarity under pressure.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Genkit](https://firebase.google.com/docs/genkit) (Gemini 2.5 Flash)
- **Location Services**: [Mappls APIs](https://www.mappls.com/) (Geocoding, Routing, Nearby Search)
- **Styling**: Tailwind CSS & ShadCN UI
- **Typography**: Bebas Neue & DM Sans

## 🚦 Getting Started

### Prerequisites

- Node.js 20+
- A Mappls API Key
- A Google AI (Gemini) API Key

### Installation

1. Clone the repository:
   ```bash
   git clone <your-repo-url>
   cd resq-link
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Environment Variables:
   Create a `.env` file in the root:
   ```env
   GOOGLE_GENAI_API_KEY=your_gemini_key
   MAPPLS_API_KEY=your_mappls_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

## 🧠 AI Tools (The "MCP" Layer)

The application utilizes Genkit Tools to interact with real-world location data:
- `findNearbyPlaces`: Locates emergency infrastructure.
- `evaluateDispatchOptions`: Compares responder times via Distance Matrix.
- `getOptimalRoute`: Calculates precise ETA and turn-by-turn paths.
- `geocodeAddress`: Converts physical addresses to coordinates for rescue accuracy.

## 📄 License

MIT License - Copyright (c) 2024 RESQ-LINK Team
