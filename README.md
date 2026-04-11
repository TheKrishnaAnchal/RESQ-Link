# RESQ-LINK | AI-Powered Emergency Response System

RESQ-LINK is a high-performance, mobile-first emergency SOS and incident reporting platform. Built with Next.js, Genkit, and Mappls (MapmyIndia) APIs, it provides real-time AI-driven dispatch optimization for critical situations.

## 🚀 Quick Start: Pushing to GitHub

If you see the error `'origin' does not appear to be a git repository`, follow these exact steps:

1.  **Create a Repository**: Go to [github.com/new](https://github.com/new) and create a repository named `resq-link`.
2.  **Copy the URL**: Copy the HTTPS link (e.g., `https://github.com/YOUR_USERNAME/resq-link.git`).
3.  **Link and Push**: Run these commands in your terminal:

```bash
# Initialize if you haven't already
git init

# Add the remote (Replace <URL> with the one you copied)
git remote add origin <URL>

# Commit your changes
git add .
git commit -m "Initial commit of RESQ-LINK platform"

# Push to the main branch
git branch -M main
git push -u origin main
```

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **AI Engine**: [Genkit](https://firebase.google.com/docs/genkit) (Gemini 2.5 Flash)
- **Location Services**: [Mappls APIs](https://www.mappls.com/) (Geocoding, Routing, Nearby Search)
- **Styling**: Tailwind CSS & ShadCN UI
- **Typography**: Bebas Neue & DM Sans

## 🚦 Environment Variables

Create a `.env` file in the root:
```env
GOOGLE_GENAI_API_KEY=your_gemini_key
MAPPLS_API_KEY=your_mappls_key
```

## 🧠 AI Tools (The "MCP" Layer)

The application utilizes Genkit Tools to interact with real-world location data:
- `findNearbyPlaces`: Locates emergency infrastructure.
- `evaluateDispatchOptions`: Compares responder times via Distance Matrix.
- `getOptimalRoute`: Calculates precise ETA and turn-by-turn paths.
- `getAddressFromCoords`: Converts physical addresses to coordinates for rescue accuracy.

## 📄 License

MIT License - Copyright (c) 2024 RESQ-LINK Team
