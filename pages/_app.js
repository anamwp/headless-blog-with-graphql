import Layout from '../components/Layout';
import '../styles/globals.css';
/**
 * This is important for the single shared layout across all pages.
 * The MyApp component is the root component for the Next.js app.
 * https://nextjs.org/docs/pages/building-your-application/routing/pages-and-layouts#examples
 */
function MyApp({ Component, pageProps }) {
	return (
		<Layout>
			<Component {...pageProps} />
		</Layout>
	);
}

export default MyApp;