import Link from 'next/link';
import { getProducts, getCategories } from '@/lib/products';
import ProductList from '@/components/products/ProductList';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const selectedCategory = searchParams?.category as string | undefined;
  const searchQuery = searchParams?.query as string | undefined;
  
  const products = getProducts(selectedCategory, searchQuery);
  const categories = getCategories();

  const pageTitle = selectedCategory 
    ? selectedCategory 
    : searchQuery 
    ? `Search results for "${searchQuery}"`
    : 'All Products';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        <aside className="md:col-span-1">
          <Card>
            <CardContent className="p-4">
              <h2 className="mb-4 font-headline text-xl font-semibold">Categories</h2>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/products"
                    className={cn(
                      'block rounded-md px-3 py-2 text-sm hover:bg-muted',
                      !selectedCategory && 'bg-muted font-semibold'
                    )}
                  >
                    All Products
                  </Link>
                </li>
                {categories.map((category) => (
                  <li key={category}>
                    <Link
                      href={`/products?category=${encodeURIComponent(category)}`}
                      className={cn(
                        'block rounded-md px-3 py-2 text-sm hover:bg-muted',
                        selectedCategory === category && 'bg-muted font-semibold'
                      )}
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </aside>

        <main className="md:col-span-3">
          <h1 className="mb-6 font-headline text-3xl font-bold">{pageTitle}</h1>
          <ProductList products={products} />
        </main>
      </div>
    </div>
  );
}
