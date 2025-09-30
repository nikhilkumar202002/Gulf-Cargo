import type { Metadata } from "next";
import "./globals.css";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import BackToTop from "./components/common/BackToTop";
import WhatsAppFab from "./components/common/WhatsAppFab";
import Tracking from "./components/common/Tracking";

export const metadata: Metadata = {
  title: "Gulf Cargo | Freight Forwarding & Logistics Services in GCC",
  description: "Reliable cargo & logistics company in GCC with 13+ years expertise. Door-to-door delivery, freight forwarding, relocation, customs clearance & warehousing.",
  icons: {
    icon: "/Logo.png", 
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
      <Header/>
      <main>{children}</main>
       <Footer/>
       <WhatsAppFab />
       <Tracking/>
       <BackToTop/>
      </body>
    </html>
  );

}
