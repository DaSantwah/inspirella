"use client";

import { useState } from "react";
import Link from "next/link";
import { Upload, Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>
        <Link href="/" onClick={() => setIsOpen(false)}>
          Inspir<span style={{ color: '#c8a2c8' }}>ella</span><span>.</span>
        </Link>
      </div>

      {/* Hamburger icon */}
      <button 
        className={styles.mobileMenuBtn} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={28} color="#fff" /> : <Menu size={28} color="#fff" />}
      </button>

      {/* Nav Links */}
      <nav className={`${styles.navLinks} ${isOpen ? styles.open : ""}`}>
        <Link href="/" onClick={() => setIsOpen(false)}>Inicio</Link>
        <Link href="/blog" onClick={() => setIsOpen(false)}>Blog</Link>
        <Link href="/galeria" onClick={() => setIsOpen(false)}>Galería</Link>
        <Link href="/comunidad" onClick={() => setIsOpen(false)}>Comunidad</Link>
        <Link href="/subir-obra" className="btn-primary" id="btn-subir" onClick={() => setIsOpen(false)}>
          Sube tu obra <Upload size={18} />
        </Link>
      </nav>
    </header>
  );
}
