# **App Name**: RESQ-LINK

## Core Features:

- Emergency SOS Dispatch: A prominent, interactive SOS button that triggers an emergency alert after a 'hold to activate' gesture, with additional quick-action buttons for instant, specific emergency dispatches (Fire, Medical, Flood/Disaster).
- AI-Driven Dispatch Status Display: After an SOS is activated, the app displays real-time mock data reflecting AI-powered dispatch decisions, including the nearest unit assigned, estimated time of arrival (ETA), and a placeholder for a live tracking map. Should actual map integration be pursued, the Mappls API will be utilized.
- Local Agency Discovery: Users can explore and search a directory of nearby emergency agencies, view their status, distance, and access detailed information such as contact numbers and operating hours via an interactive modal. For any future live map functionality showing a map pin, the Mappls API would be used.
- Multi-Step Incident Reporting: A guided, multi-step form allowing users to submit detailed reports or feedback, featuring a text area with character count and a UI component for attaching optional mock photos.
- User Profile and History: A dedicated screen for users to view their personal details and review a static history of their past SOS alerts and submitted reports.
- Intelligent Report Classification Tool (Mocked): As part of the incident reporting feature, this conceptual AI tool, though mocked for the MVP, would analyze the user's free-text issue description and uploaded (mock) photos to assist in classifying and understanding the reported issue, potentially suggesting pre-filled fields or priorities.

## Style Guidelines:

- Background: Near-black (#0D0D0D) providing a dark, high-contrast command-center aesthetic, envisioned with a subtle warm grain overlay for texture.
- Primary action color: Emergency Red (#FF2D2D), used for critical interactive elements like the SOS button, conveying immediate urgency and ensuring high visibility on the dark background.
- Alerts accent color: Amber (#F5A623), employed for status indicators and less critical alerts, providing a distinct yet harmonious contrast to the primary red and background.
- Text color: Pure White, utilized for all textual content to ensure maximum readability and sharp contrast against the dark background, maintaining a clear and authoritative information display.
- Heading font: 'Bebas Neue' (sans-serif) or 'Black Han Sans' (sans-serif), chosen for their bold, condensed styles to impart a strong, modern, and commanding visual presence for titles and hero text. Note: currently only Google Fonts are supported.
- Body text font: 'DM Sans' (sans-serif), selected for its clear, neutral, and highly readable qualities, making it ideal for presenting general information and form inputs without distraction. Note: currently only Google Fonts are supported.
- All icons will be sourced from 'lucide-react', adhering to a clean, minimal line-art aesthetic that aligns with the app's modern, functional command-center theme and ensures consistent visual language.
- The application features a mobile-first design, with a base width of 375px. Navigation is streamlined with a persistent bottom navigation bar, offering quick access to primary screens.
- Content is organized within glassmorphism-style cards, characterized by dark, frosted panels that add depth and a sophisticated digital aesthetic while maintaining clear readability of the overlaid information.
- Animations will include a pulsing red ring effect for the interactive SOS button and a smooth fade-out for the initial splash screen, providing dynamic user feedback and a polished feel without being intrusive.