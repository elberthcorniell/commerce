import Grid from 'components/grid';
import { Container } from 'components/layout/container';
import Footer from 'components/layout/footer';
import ProductGridItems from 'components/layout/product-grid-items';
import { getCollectionProducts } from 'lib/shopify';

export const metadata = {
  description: 'Lentes de sol de alta calidad',
  openGraph: {
    type: 'website',
    images: ['/og-image.jpg']
  }
};

export default async function HomePage() {
  const products = await getCollectionProducts({ collection: 'disponibles' });

  return (
    <Container>
      <Grid className=" grid w-full grid-cols-2 gap-y-16 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
        <ProductGridItems products={products} />
      </Grid>
      <Footer />
    </Container>
  );
}
