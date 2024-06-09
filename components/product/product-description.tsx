import { AddToCart } from 'components/cart/add-to-cart';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { ProductHeader } from './product-header';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <div className=" flex flex-col">
      <ProductHeader product={product} className=" hidden md:block" />
      <h3 className=" my-5 font-bold">CONOCE MÁS</h3>
      <p className="mb-6 whitespace-pre-line text-base font-thin leading-7">
        {product.description}
      </p>

      <Suspense fallback={null}>
        <AddToCart variants={product.variants} availableForSale={product.availableForSale} />
      </Suspense>
    </div>
  );
}
