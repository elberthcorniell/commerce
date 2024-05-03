import Grid from 'components/grid';
import { Container } from 'components/layout/container';
import Footer from 'components/layout/footer';
import ProductGridItems from 'components/layout/product-grid-items';
import { getCollectionProducts } from 'lib/shopify';

export const metadata = {
  description: 'High-performance ecommerce store built with Next.js, Vercel, and Shopify.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const products = await getCollectionProducts({ collection: 'disponibles' });

  return (
    <Container>
      <Grid className=" grid w-full grid-cols-2 gap-0 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        <ProductGridItems products={products} />
      </Grid>
      <Footer />
    </Container>
  );
}
