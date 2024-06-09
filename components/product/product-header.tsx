import Price from 'components/price';
import { Product } from 'lib/shopify/types';
import { Suspense } from 'react';
import { VariantSelector } from './variant-selector';

export const ProductHeader = ({ product, className }: { product: Product; className?: string }) => {
  return (
    <div className={className}>
      <div className={'mb-6 flex flex-col border-b pb-6 '}>
        <h1 className="mb-2 text-5xl font-medium">{product.title}</h1>
        <h3 className="my-2 line-clamp-2 flex-grow text-left text-sm font-thin uppercase leading-none tracking-tight ">
          Sovereign
        </h3>
        <div className="mr-auto w-auto rounded-full">
          <Price
            className="flex-none rounded-full text-base font-bold"
            amount={product.priceRange.maxVariantPrice.amount}
            currencyCode={product.priceRange.maxVariantPrice.currencyCode}
          />
        </div>
      </div>
      <Suspense fallback={null}>
        <VariantSelector options={product.options} variants={product.variants} />
      </Suspense>
    </div>
  );
};
