import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridTileImage } from 'components/grid/tile';
import { Container } from 'components/layout/container';
import Footer from 'components/layout/footer';
import { Gallery } from 'components/product/gallery';
import { ProductDescription } from 'components/product/product-description';
import { ProductHeader } from 'components/product/product-header';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { getProduct, getProductRecommendations } from 'lib/shopify';
import { Image } from 'lib/shopify/types';
import { Suspense } from 'react';

export async function generateMetadata({
  params
}: {
  params: { handle: string };
}): Promise<Metadata> {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt
            }
          ]
        }
      : null
  };
}

export default async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <Container>
        <div className="grid grid-cols-1 rounded-lg py-12 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
          <div className="col-span-1 lg:col-span-2">
            <ProductHeader product={product} className=" block md:hidden" />
            <Suspense
              fallback={<div className="relative aspect-square h-full w-full overflow-hidden" />}
            >
              <Gallery
                images={product.images.map((image: Image) => ({
                  src: image.url,
                  altText: image.altText
                }))}
                variants={product.variants}
              />
            </Suspense>
          </div>
          <div>
            <ProductDescription product={product} />
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </Container>
      <Footer />
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-20">
      <h2 className="mb-4 text-2xl font-bold uppercase ">Productos Relacionados</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="w-2/3 flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <GridTileImage
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
              sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
