import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  noOfColors
}: {
  title: string;
  amount: string;
  currencyCode: string;
  noOfColors?: number;
}) => {
  return (
    <div
      className={clsx(' m-auto !mt-4 flex w-fit', {
        // 'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex flex-col items-center justify-center gap-1 text-xs font-semibold text-black backdrop-blur-md ">
        {noOfColors && noOfColors > 0 ? (
          <p className="!m-0 hidden bg-white text-xs font-thin text-black md:block ">
            {noOfColors} {noOfColors > 1 ? 'colores' : 'color'}
          </p>
        ) : null}
        <h3 className="line-clamp-1 flex-grow text-center text-sm uppercase leading-none tracking-tight ">
          {title}
        </h3>
        <h3 className="my-2 line-clamp-2 flex-grow text-center text-sm font-thin uppercase leading-none tracking-tight ">
          Sovereign
        </h3>
        <Price
          className="flex-none rounded-full text-base"
          amount={amount}
          currencyCode={currencyCode}
        />
      </div>
    </div>
  );
};

export default Label;
