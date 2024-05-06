'use client';
import Search from 'components/layout/navbar/search';
import LoadingDots from 'components/loading-dots';
import { useState } from 'react';

export const TopSearch = () => {
  const [loading, setLoading] = useState(false);
  return (
    <div className=" w-full max-w-[550px]">
      <Search
        routingBehavior="type"
        searchEmpty
        onRouting={(event) => {
          if (event === 'started') setLoading(true);
          else setLoading(false);
        }}
      />
      <div className="h-6">{loading && <LoadingDots className={'bg-black'} />}</div>
    </div>
  );
};
