import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode
}: {
  title: string;
  amount: string;
  currencyCode: string;
}) => {
  return (
    <div
      className={clsx(' m-auto !mt-4 flex w-fit', {
        // 'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex flex-col items-center justify-center gap-3 text-xs font-semibold text-black backdrop-blur-md ">
        <h3 className="line-clamp-2 flex-grow text-center text-sm uppercase leading-none tracking-tight ">
          {title}
        </h3>
        <h3 className="line-clamp-2 flex-grow text-center text-sm font-thin uppercase leading-none tracking-tight ">
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
