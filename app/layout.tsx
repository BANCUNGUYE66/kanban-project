import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "TaskFlow App",
  description: "Next.js Kanban Application",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // 👇 Add suppressHydrationWarning here
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}