import "./globals.css";

export const metadata = {
  title: "Hogwarts Trivia — The Wizarding Challenge",
  description:
    "A front-end Harry Potter trivia game with house selection, difficulty levels, sound, a leaderboard, and an animated Marauder's Map background."
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=EB+Garamond:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
