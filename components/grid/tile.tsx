import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    position?: 'bottom' | 'center';
  };
  hoverSrc?: string;
} & React.ComponentProps<typeof Image>) {
  return (
    <div className=" flex h-full w-full flex-col overflow-hidden rounded-lg bg-white p-4 hover:border-blue-600">
      <div
        className={clsx('group flex h-full w-full items-center justify-center ', {
          relative: label,
          'border-2 border-blue-600': active,
          'border-neutral-200 ': !active
        })}
      >
        {props.src ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
          <Image
            className={clsx('relative h-full w-full object-contain', {
              'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
              // 'group-hover:opacity-0': !!props.hoverSrc
            })}
            {...props}
          />
        ) : null}
        {props.hoverSrc ? (
          // eslint-disable-next-line jsx-a11y/alt-text -- `alt` is inherited from `props`, which is being enforced with TypeScript
          <Image
            className={clsx(
              'relative h-full w-full object-contain opacity-0 group-hover:opacity-100',
              {
                'transition duration-300 ease-in-out group-hover:scale-105': isInteractive
              }
            )}
            {...props}
            src={props.hoverSrc}
          />
        ) : null}
      </div>
      {label ? (
        <Label title={label.title} amount={label.amount} currencyCode={label.currencyCode} />
      ) : null}
    </div>
  );
}
