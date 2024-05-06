'use client';

import { CheckIcon, PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import { ProductVariant } from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  className,
  cta
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  className?: string;
  cta?: string;
}) {
  const { pending } = useFormStatus();
  const buttonClasses = clsx(
    'relative flex w-full items-center justify-center bg-black p-4 tracking-wide text-white md:z-10 z-30',
    className
  );
  const disabledClasses = 'cursor-not-allowed !text-opacity-50 hover:!text-opacity-50 ';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        No disponible en este color
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        {cta || 'Agregar al carrito'}
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label={cta || 'Agregar al carrito'}
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        [disabledClasses]: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? (
          <LoadingDots
            className={clsx('mb-3', {
              'bg-white': !className?.includes('text-black'),
              'bg-black': className?.includes('text-black')
            })}
          />
        ) : cta ? (
          <CheckIcon className="h-5" />
        ) : (
          <PlusIcon className="h-5" />
        )}
      </div>
      {cta || 'Agregar al carrito'}
    </button>
  );
}

export function AddToCart({
  variants,
  availableForSale
}: {
  variants: ProductVariant[];
  availableForSale: boolean;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === searchParams.get(option.name.toLowerCase())
    )
  );
  const selectedVariantId = variant?.id || defaultVariantId;
  const actionWithVariant = formAction.bind(null, { selectedVariantId });
  const actionWithVariantAndCheckout = formAction.bind(null, {
    selectedVariantId,
    checkout: true
  });

  const finalIsAvailableForSale = variant?.availableForSale ?? availableForSale;

  return (
    <div>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
      <form
        action={actionWithVariant}
        className={clsx(' fixed left-0 h-fit w-screen md:relative md:bottom-2 md:w-auto', {
          'bottom-0': !finalIsAvailableForSale,
          'bottom-14': finalIsAvailableForSale
        })}
      >
        <SubmitButton
          availableForSale={finalIsAvailableForSale}
          selectedVariantId={selectedVariantId}
        />
      </form>
      {finalIsAvailableForSale && (
        <form
          action={actionWithVariantAndCheckout}
          className=" fixed bottom-0 left-0 h-fit w-screen md:relative md:w-auto"
        >
          <SubmitButton
            availableForSale={finalIsAvailableForSale}
            selectedVariantId={selectedVariantId}
            cta="Comprar ahora"
            className=" !bg-white !text-black md:!bg-black md:!text-white "
          />
        </form>
      )}
    </div>
  );
}
