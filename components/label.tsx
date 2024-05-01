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
        <h3 className="mr-4 line-clamp-2 flex-grow text-sm leading-none tracking-tight ">
          {title}
        </h3>
        <Price
          className="flex-none rounded-full bg-blue-600 p-2 text-white"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
