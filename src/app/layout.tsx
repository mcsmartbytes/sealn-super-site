import './globals.css';

export const metadata = {
  title: "Seal'n & Stripe'n Specialist",
  description: 'Professional Parking Lot Services',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Seal'n & Stripe'n"
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-900">{children}</body>
    </html>
  );
}

