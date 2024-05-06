import { Dispatch, SetStateAction, useCallback, useRef, useState } from 'react';

export const useDebouncedState = <T>(
  initialState: T,
  delay: number
): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(initialState);
  const handler = useRef<ReturnType<typeof setTimeout>>();
  const delayRef = useRef(delay);

  // eslint-disable-next-line
  const setDebouncedValue = useCallback((newValue: T | ((prev: T) => any), _delay?: number) => {
    if (handler.current) clearTimeout(handler.current);
    handler.current = setTimeout(() => {
      setValue(newValue);
    }, _delay || delayRef.current);
  }, []);

  return [value, setDebouncedValue];
};
