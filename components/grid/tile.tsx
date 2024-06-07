'use client';
import clsx from 'clsx';
import { ProductVariant } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import Label from '../label';

export function GridTileImage({
  tryDefaultVariant,
  isInteractive = true,
  active,
  label,
  href,
  productHandle,
  variants,
  className,
  ...props
}: {
  tryDefaultVariant?: string;
  isInteractive?: boolean;
  active?: boolean;
  productHandle: string;
  href?: string;
  className?: string;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
  variants?: ProductVariant[];
  hoverSrc?: string;
} & React.ComponentProps<typeof Image>) {
  const random = useRef(Math.floor(Math.random() * (variants?.length || 0)));
  const index = useRef(
    tryDefaultVariant
      ? variants?.findIndex((variant) =>
          variant.title.toLocaleLowerCase().includes(tryDefaultVariant.toLocaleLowerCase() || '')
        ) ?? random.current
      : random.current
  );
  const [activeImage, setActiveImage] = useState(() => {
    return variants?.[index.current]?.image.url || props.src;
  });
  const [variant, setVariant] = useState(variants?.[index.current]?.title || '');
  const selectionRef = useRef(false);
  const containerStyle = props.fill ? { paddingBottom: '100%' } : {};
  const isDefaultVariant = variant === variants?.[0]?.title;

  useEffect(() => {
    setActiveImage(variants?.[index.current]?.image.url || props.src);
    setVariant(variants?.[index.current]?.title || '');
  }, [productHandle, variants, props.src]);

  return (
    <Link
      className="relative h-full w-full"
      href={
        href ||
        `/products/${productHandle}?${new URLSearchParams({
          color: variant || ''
        })}`
      }
      onClick={(e) => {
        if (selectionRef.current) {
          e.preventDefault();
          selectionRef.current = false;
        }
      }}
    >
      <div
        className={clsx(
          ' group flex h-full w-full flex-col overflow-hidden bg-white p-0 hover:border-blue-600 md:p-4',
          className
        )}
      >
        <div
          style={containerStyle}
          className={clsx('group relative flex h-full w-full items-center justify-center ', {
            relative: label,
            'border-2 border-blue-600': active,
            'border-neutral-200 ': !active
          })}
        >
          {props.src ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
            <Image
              className={clsx('aspect-square h-full w-full object-cover', {
                'transition duration-300 ease-in-out': isInteractive
                // 'group-hover:opacity-0': !!props.hoverSrc
              })}
              {...props}
              src={activeImage}
            />
          ) : null}
          {props.hoverSrc && isDefaultVariant ? (
            // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
            <Image
              className={clsx(
                'aspect-square h-full w-full object-cover opacity-0 group-hover:opacity-100',
                {
                  'transition duration-300 ease-in-out': isInteractive
                }
              )}
              {...props}
              src={props.hoverSrc}
            />
          ) : null}
        </div>
        <div className=" z-10 flex h-[58px] flex-shrink-0 flex-row gap-1 overflow-x-auto overflow-y-hidden bg-white py-2 transition-all duration-300 md:-mb-[58px] md:opacity-0 md:group-hover:opacity-100 ">
          {variants?.map((_variant) => (
            <button
              className={clsx(' h-12 w-12 flex-shrink-0  ', {
                'border-2 border-blue-600': _variant.title === variant,
                'border-neutral-200': _variant.title !== variant
              })}
              onClick={() => {
                selectionRef.current = true;
                setVariant(_variant.title);
                setActiveImage(_variant.image.url);
              }}
              key={_variant.id}
            >
              <Image
                width={48}
                height={48}
                src={_variant.image?.url}
                alt={_variant.image?.altText}
              />
            </button>
          ))}
        </div>
        {label ? (
          <Label
            title={label.title}
            amount={label.amount}
            currencyCode={label.currencyCode}
            noOfColors={variants?.length}
          />
        ) : null}
      </div>
    </Link>
  );
}
