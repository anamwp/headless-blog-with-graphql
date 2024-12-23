import React from 'react';
import Link from 'next/link';

const Layout = ({ children }) => {
  return (
    <>
      <header style={styles.header}>
        <nav>
          <ul style={styles.navList}>
            <li><Link href="/">Home</Link></li>
            <li><Link href="/about">About</Link></li>
            <li><Link href="/category">Category</Link></li>
            <li><Link href="/tag">Tag</Link></li>
          </ul>
        </nav>
      </header>

      <main style={styles.main}>
        {children}
      </main>

      <footer style={styles.footer}>
        <p>&copy; {new Date().getFullYear()} My WordPress Blog</p>
      </footer>
    </>
  );
};

const styles = {
  header: {
    background: '#333',
    color: '#fff',
    padding: '10px 20px',
  },
  navList: {
    listStyle: 'none',
    display: 'flex',
    gap: '15px',
    padding: 0,
    margin: 0,
  },
  main: {
    minHeight: '80vh',
    padding: '20px',
  },
  footer: {
    background: '#333',
    color: '#fff',
    textAlign: 'center',
    padding: '10px',
  },
};

export default Layout;