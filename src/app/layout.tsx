
import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'RESQ-LINK | Emergency Response',
  description: 'AI-Powered Emergency SOS and Incident Reporting',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground overflow-x-hidden min-h-screen">
        <div className="grain-overlay" />
        <main className="max-w-[375px] mx-auto min-h-screen relative pb-24 shadow-2xl bg-background border-x border-white/5">
          {children}
        </main>
      </body>
    </html>
  );
}
