import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { LanguageProvider } from "@/providers/language-provider";
import QueryProvider from "@/providers/QueryProvider";
import { AuthProvider } from "@/providers/authProvider";
import ClientOnly from "@/providers/ClientOnly";
import { Toaster } from "react-hot-toast";
import Footer from "@/components/footer";
const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Herbal Life ",
  description:
    "Get the latest Product",
  openGraph: {
    title: "Herbal Life",
    description:
      "Get the latest Product",
    url: "https://rmtechbd.com",
    siteName: "Herbal Life",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Herbal Life",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className}bg-white`}>
        <ClientOnly>
          <ThemeProvider
            attribute="class"
            defaultTheme="light" // 👈 this makes light the default
            enableSystem={true}
          >
            <QueryProvider>
              <AuthProvider>
                <LanguageProvider>
                  {children}
                  <Footer />
                </LanguageProvider>
                <Toaster position="top-right" />
              </AuthProvider>
            </QueryProvider>
          </ThemeProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
