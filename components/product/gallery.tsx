'use client';

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { GridTileImage } from 'components/grid/tile';
import { ProductVariant } from 'lib/shopify/types';
import { createUrl } from 'lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function Gallery({
  images,
  variants
}: {
  images: { src: string; altText: string }[];
  variants: ProductVariant[];
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const imageSearchParam = searchParams.get('image');
  const colorVariant = searchParams.get('color') || variants[0]?.selectedOptions[0]?.value;
  const variantIndex = variants.findIndex((v) => v.title === colorVariant);

  const variantData = variants[variantIndex];
  const nextVariantIndex = variantIndex + 1;
  const nextVariantData = variants[nextVariantIndex];
  const imageIndex = imageSearchParam ? parseInt(imageSearchParam) : 0;
  const firstImageIndex = images.findIndex((image) => image.src === variantData?.image.url);
  const lastImageIndex = nextVariantData
    ? images.findIndex((image) => image.src === nextVariantData?.image.url)
    : images.length;
  const clonedImages = [...images];
  const filteredImages = clonedImages.slice(firstImageIndex, lastImageIndex);

  const nextSearchParams = new URLSearchParams(searchParams.toString());
  const nextImageIndex = imageIndex + 1 < images.length ? imageIndex + 1 : 0;
  nextSearchParams.set('image', nextImageIndex.toString());
  const nextUrl = createUrl(pathname, nextSearchParams);

  const previousSearchParams = new URLSearchParams(searchParams.toString());
  const previousImageIndex = imageIndex === 0 ? images.length - 1 : imageIndex - 1;
  previousSearchParams.set('image', previousImageIndex.toString());
  const previousUrl = createUrl(pathname, previousSearchParams);

  const buttonClassName =
    'h-full flex items-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black justify-center';

  return (
    <div>
      <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
        {filteredImages[imageIndex] && (
          <Image
            className="h-full w-full object-contain"
            fill
            sizes="(min-width: 1024px) 66vw, 100vw"
            alt={filteredImages[imageIndex]?.altText as string}
            src={filteredImages[imageIndex]?.src as string}
            priority={true}
          />
        )}
        {filteredImages.length > 1 ? (
          <div className="absolute bottom-[15%] flex w-full flex-wrap justify-center">
            <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur ">
              <Link
                aria-label="Previous product image"
                href={previousUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowLeftIcon className="h-5" />
              </Link>
              <div className="mx-1 h-6 w-px bg-neutral-500"></div>
              <Link
                aria-label="Next product image"
                href={nextUrl}
                className={buttonClassName}
                scroll={false}
              >
                <ArrowRightIcon className="h-5" />
              </Link>
            </div>
          </div>
        ) : null}
      </div>

      {filteredImages.length > 1 ? (
        <ul className="mb-12 mt-2 flex items-center justify-center gap-2 overflow-auto py-1 lg:mb-0">
          {filteredImages.map((image, index) => {
            const isActive = index === imageIndex;
            const imageSearchParams = new URLSearchParams(searchParams.toString());

            imageSearchParams.set('image', index.toString());

            return (
              <li key={image.src} className="h-20 w-20 flex-shrink-0">
                <GridTileImage
                  href={createUrl(pathname, imageSearchParams)}
                  className="rounded-none !p-0"
                  productHandle={''}
                  alt={image.altText}
                  src={image.src}
                  width={80}
                  height={80}
                  active={isActive}
                />
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
