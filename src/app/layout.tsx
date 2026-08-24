import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Wizeline Best Practices Pulse",
  description: "Static self-diagnostic for engineering habits and practical improvement prompts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      style={{
        "--font-heading": 'Avenir Next, "Helvetica Neue", Helvetica, sans-serif',
        "--font-mono": '"SFMono-Regular", Consolas, "Liberation Mono", monospace',
      } as React.CSSProperties}
    >
      <body>
        <div className="shell">
          <nav className="nav-bar">
            <Link href="/" className="nav-brand">
              Best Practices Pulse
            </Link>
            <ul className="nav-links">
              <li>
                <Link href="/assessment">Assessment</Link>
              </li>
              <li>
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li>
                <Link href="/playbook">Playbook</Link>
              </li>
            </ul>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
