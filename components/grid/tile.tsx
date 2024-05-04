'use client';
import clsx from 'clsx';
import { ProductVariant } from 'lib/shopify/types';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  href,
  productHandle,
  variants,
  className,
  ...props
}: {
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
  const [activeImage, setActiveImage] = useState(props.src);
  const [variant, setVariant] = useState(variants?.[0]?.title || '');
  const selectionRef = useRef(false);
  const containerStyle = props.fill ? { paddingBottom: '100%' } : {};
  const isDefaultVariant = variant === variants?.[0]?.title;

  return (
    <Link
      className="relative h-full w-full"
      href={href || `/products/${productHandle}?color=${variant}`}
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
          {variants && variants.length > 0 ? (
            <p className="absolute bottom-0 left-0 z-10 bg-white p-1 text-xs font-semibold text-black">
              {variants.length} {variants.length > 1 ? 'colores' : 'color'}
            </p>
          ) : null}
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
        <div className=" z-20 flex h-[88px] flex-shrink-0 flex-row items-center gap-2 overflow-x-auto overflow-y-hidden bg-white py-2 transition-all duration-300 md:-mt-[88px] md:opacity-0 md:group-hover:opacity-100 ">
          {variants?.map((_variant) => (
            <button
              className={clsx(' h-16 w-16 flex-shrink-0  ', {
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
                width={80}
                height={80}
                src={_variant.image?.url}
                alt={_variant.image?.altText}
              />
            </button>
          ))}
        </div>
        {label ? (
          <Label title={label.title} amount={label.amount} currencyCode={label.currencyCode} />
        ) : null}
      </div>
    </Link>
  );
}
