import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"]
});

export const metadata = {
  title: "Chess",
  description: "Multiplaer Chess",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/wn.png" type="image/png" />
      </head>
      <body
        className={`${poppins.variable} antialiased overflow-hidden`}
      >
        {children}
      </body>
    </html>
  );
}
