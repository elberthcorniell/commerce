import Grid from 'components/grid';
import { GridTileImage } from 'components/grid/tile';
import { Product } from 'lib/shopify/types';

export default function ProductGridItems({
  products,
  tryDefaultVariant
}: {
  products: Product[];
  tryDefaultVariant?: string;
}) {
  return (
    <>
      {products.map((product) => (
        <Grid.Item
          key={`${product.id}-${tryDefaultVariant || 'random-variant'}`}
          className="!aspect-auto animate-fadeIn"
        >
          <GridTileImage
            key={`tile-${product.id}-${tryDefaultVariant || 'random-variant'}`}
            tryDefaultVariant={tryDefaultVariant}
            alt={product.title}
            productHandle={product.handle}
            label={{
              title: product.title,
              amount: product.priceRange.maxVariantPrice.amount,
              currencyCode: product.priceRange.maxVariantPrice.currencyCode
            }}
            variants={product.variants}
            src={product.featuredImage?.url}
            fill
            hoverSrc={product.images[1]?.url}
            sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </Grid.Item>
      ))}
    </>
  );
}
