import { Space_Grotesk, Sora } from 'next/font/google';
import './globals.css';

const heading = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-heading' 
});

const body = Sora({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-body' 
});

export const metadata = {
  title: "Berry’s Kitchen | For a Healthy Gut",
  description: "Abuja’s premier destination for artisanal fermented foods.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${heading.variable} ${body.variable} font-sans bg-primary selection:bg-secondary selection:text-white`}>
        {children}
      </body>
    </html>
  );
}