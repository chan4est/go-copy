import './globals.css';

export const metadata = {
  title: 'GO Copy!',
  description:
    'Nickname your favorites in Pokémon GO by tapping and then pasting!',
  keywords: ['Pokemon GO', 'Nickname', 'Foreign'],
  creator: 'Chandler Forrest',
  metadataBase: new URL('https://go-copy-production.up.railway.app'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
    },
  },
  openGraph: {
    title: 'GO Copy!',
    description:
      'Nickname your favorites in Pokémon GO by tapping and then pasting!',
    url: 'https://go-copy-production.up.railway.app',
    siteName: 'GO Copy!',
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
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link
          rel="icon"
          href="/icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
        <link
          rel="apple-touch-icon"
          href="/apple-icon?<generated>"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
