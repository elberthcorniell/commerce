import { Container } from 'components/layout/container';
import Footer from 'components/layout/footer';
import Collections from 'components/layout/search/collections';
import FilterList from 'components/layout/search/filter';
import { sorting } from 'lib/constants';

export default function SearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Container>
        <div className=" relative grid grid-cols-1 gap-4 md:grid-cols-[200px_1fr]">
          <div className="sticky order-first w-full">
            <Collections />
            <FilterList list={sorting} title="Sort by" />
          </div>
          <div className="order-last min-h-screen w-full md:order-none">{children}</div>
        </div>
      </Container>
      <Footer />
    </>
  );
}
