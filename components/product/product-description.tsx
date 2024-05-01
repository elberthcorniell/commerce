import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className=" flex flex-col">
      <div className="mb-6 flex flex-col border-b pb-6 ">
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <div className="mr-auto w-auto rounded-full bg-blue-600 p-2 text-sm text-white">
          <Price
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <Suspense fallback={null}>
        <VariantSelector options={product.options} variants={product.variants} />
      </Suspense>

      <p className="mb-6 whitespace-pre-line text-sm leading-tight">{product.description}</p>

      <Suspense fallback={null}>
        <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
      </Suspense>
    </div>
  );
}
