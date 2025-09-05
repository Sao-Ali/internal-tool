// app/layout.tsx
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata = {
  title: "Ali Sao",
  description: "One-stop for Ali's work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
