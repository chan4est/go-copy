import './globals.css';
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
  title: 'GO Copy | A Pokémon GO Nicknaming Tool',
  description:
    'Nickname your favorite Pokémon in Pokémon GO by tapping and pasting!',
  keywords: ['Pokemon GO', 'nickname', 'foreign', 'copy paste'],
  creator: 'Chandler Forrest',
  metadataBase: new URL('https://www.pokemongocopy.com/'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'GO Copy | A Pokémon GO Nicknaming Tool',
    description:
      'Nickname your favorite Pokémon in Pokémon GO by tapping and pasting!',
    url: 'https://www.pokemongocopy.com/',
    siteName: 'GO Copy',
    image: {
      url: '/opengraph-image.png',
      width: 1200,
      height: 630,
    },

    locale: 'en_US',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" translate="no">
      <body id="root">{children}</body>
      <GoogleAnalytics gaId="G-HS8XF6LN4Z" />
    </html>
  );
}
