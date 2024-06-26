import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { defaultSort, sorting } from 'lib/constants';
import { getProducts } from 'lib/shopify';
import { TopSearch } from './search';

export const metadata = {
  title: 'Search',
  description: 'Buscar productos in the store.'
};

export default async function SearchPage({
  searchParams
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { sort, q: searchValue } = searchParams as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;

  const products = await getProducts({ sortKey, reverse, query: searchValue });
  const resultsText = products.length > 1 ? 'resultados' : 'resultado';

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchValue?.toLowerCase() || '') ||
      product.variants.some((variant) =>
        variant.title.toLowerCase().includes(searchValue?.toLowerCase() || '')
      )
  );

  const remainingProducts = products.filter((product) => !filteredProducts.includes(product));

  return (
    <>
      <TopSearch />
      {searchValue ? (
        <p className="mb-4">
          {products.length === 0
            ? 'No hay resultados para la busqueda. '
            : `Mostrando ${filteredProducts.length} ${resultsText} para `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {filteredProducts.length > 0 ? (
        <Grid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={filteredProducts} tryDefaultVariant={searchValue} />
        </Grid>
      ) : null}
      {remainingProducts.length ? (
        <p className="mb-4 mt-10">
          {'Otros resultados para '}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {remainingProducts.length > 0 ? (
        <Grid className="grid-cols-2 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={remainingProducts} />
        </Grid>
      ) : null}
    </>
  );
}
