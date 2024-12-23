import Layout from '../components/Layout';
import '../styles/globals.css'; // Import global styles if needed

function MyApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;