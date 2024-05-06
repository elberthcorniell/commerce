'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useDebouncedState } from 'lib/hooks/debounced-state';
import { getProducts } from 'lib/shopify';
import { Product } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export default function Search({
  onSubmit: _onSubmit,
  onRouting,
  routingBehavior,
  searchEmpty
}: {
  onSubmit?: () => void;
  // eslint-disable-next-line
  onRouting?: (x: 'started' | 'completed') => void;
  routingBehavior?: 'enter' | 'type';
  searchEmpty?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [search, setSearch] = useDebouncedState(searchParams.get('q') || '', 500);
  const [products, setProducts] = useState<Product[]>([]);
  const productSearchRef = useRef('');
  const formRef = useRef<HTMLFormElement>(null);
  const awaitedPathRef = useRef('');

  useEffect(() => {
    if (!awaitedPathRef || !onRouting) return;
    if (awaitedPathRef.current === createUrl(pathname, searchParams)) {
      onRouting?.('completed');
      awaitedPathRef.current = '';
    }
  }, [pathname, searchParams, onRouting]);

  useEffect(() => {
    (async () => {
      if (!search && !searchEmpty) return setProducts([]);
      if (routingBehavior === 'type') {
        formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
        return;
      }
      if (search === productSearchRef.current) return;
      const products = await getProducts({ query: search });
      productSearchRef.current = search;
      setProducts(products);
    })();
  }, [search, routingBehavior, searchEmpty]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const val = e.target as HTMLFormElement;
    const search = val.search as HTMLInputElement;
    const newParams = new URLSearchParams(searchParams.toString());

    if (search.value) {
      newParams.set('q', search.value);
    } else {
      newParams.delete('q');
    }
    onRouting?.('started');
    _onSubmit?.();
    const path = createUrl('/search', newParams);
    awaitedPathRef.current = path;
    router.push(path);
  }

  return (
    <div className=" z-40">
      <form
        onSubmit={onSubmit}
        ref={formRef}
        className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
      >
        <input
          key={searchParams?.get('q')}
          onFocus={(e) => e.target.select()}
          type="text"
          name="search"
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar productos..."
          autoComplete="off"
          defaultValue={search || ''}
          className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500"
        />
        <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
          <MagnifyingGlassIcon className="h-4" />
        </div>
      </form>
      {products.length ? (
        <div className=" w-max-[550px] top-14 mt-2 h-[calc(80vh-40px)] w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white shadow-lg">
          <ul>
            {products.map((product) => (
              <li
                key={product.id}
                className="flex items-center justify-between border-b border-neutral-200 p-4"
              >
                <Link href={`/products/${product.handle}`} onClick={_onSubmit} className="">
                  <div className=" flex items-center gap-4">
                    <Image
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      width={48}
                      height={48}
                      className="rounded-md"
                    />
                    {product.title}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Buscar productos..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
