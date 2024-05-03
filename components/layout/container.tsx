export const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <div className=" mx-auto max-w-[1180px]">{children}</div>
    </div>
  );
};
