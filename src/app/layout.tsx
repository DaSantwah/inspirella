import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Upload } from "lucide-react";
import styles from "./layout.module.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export const metadata: Metadata = {
  title: "Inspirella | Red de Creadoras y Blog",
  description: "Plataforma dedicada a la difusión del trabajo de mujeres artistas, cineastas, ilustradoras y diseñadoras. Blog de opinión y comunidad.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${outfit.variable}`}>
        <header className={styles.navbar}>
          <div className={styles.logo}>
            <Link href="/">Inspir<span style={{ color: '#c8a2c8' }}>ella</span><span>.</span></Link>
          </div>
          <nav className={styles.navLinks}>
            <Link href="/">Inicio</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/galeria">Galería</Link>
            <Link href="/comunidad">Comunidad</Link>
            <Link href="/subir-obra" className="btn-primary" id="btn-subir">
              Sube tu obra <Upload size={18} />
            </Link>
          </nav>
        </header>

        <main className={styles.mainContent}>
          {children}
        </main>

        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <div className={styles.footerBrand}>
              <h2>Inspir<span style={{ color: '#c8a2c8' }}>ella</span><span>.</span></h2>
              <p>Impulsando el talento femenino en el arte, diseño y la opinión crítica.</p>
            </div>
            <div className={styles.footerLinks}>
              <h3>Enlaces</h3>
              <Link href="/blog">Blog</Link>
              <Link href="/galeria">Galería</Link>
              <Link href="/comunidad">Comunidad</Link>
              <Link href="/admin">Panel Admin</Link>
            </div>
            <div className={styles.footerSocial}>
              <h3>Síguenos</h3>
              <div className={styles.socialIcons}>
                <a href="#">IG</a>
                <a href="#">TW</a>
                <a href="#">IN</a>
              </div>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>&copy; 2026 Inspirella. Todos los derechos reservados.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
