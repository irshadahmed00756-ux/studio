import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts, getCategories } from '@/lib/products';
import ProductCard from '@/components/products/ProductCard';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const featuredProducts = getProducts().slice(0, 4);
  const categories = getCategories();
  
  const categoryImages = {
    "Haldi Platters": PlaceHolderImages.find(p => p.id === "haldi-platter-1"),
    "Mehndi Platters": PlaceHolderImages.find(p => p.id === "mehndi-platter-1"),
    "Engagement Accessories": PlaceHolderImages.find(p => p.id === "engagement-pen-1"),
    "Hampers": PlaceHolderImages.find(p => p.id === "hamper-1"),
    "Nikah Pens": PlaceHolderImages.find(p => p.id === "nikah-pen-1"),
    "Ring Platters": PlaceHolderImages.find(p => p.id === "ring-platter-1"),
  };

  return (
    <div className="flex flex-col">
      <section className="relative h-[60vh] w-full">
        <Image
          src="https://picsum.photos/seed/hero/1920/1080"
          alt="Handmade traditional crafts"
          data-ai-hint="wedding decor"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col items-center justify-center text-center text-white">
          <h1 className="font-headline text-5xl font-bold tracking-tight md:text-7xl">
            Aesthetic Nasra
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Exquisite Handmade Creations for Your Special Moments
          </p>
          <Button asChild className="mt-8 bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
            <Link href="/products">Shop Now</Link>
          </Button>
        </div>
      </section>

      <section className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:text-4xl">
            Our Categories
          </h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((category) => {
              const categoryImage = categoryImages[category as keyof typeof categoryImages];
              return (
              <Link href={`/products?category=${encodeURIComponent(category)}`} key={category}>
                <Card className="overflow-hidden transition-transform duration-300 ease-in-out hover:scale-105 hover:shadow-lg">
                  <CardContent className="relative aspect-square p-0">
                    {categoryImage && (
                       <Image
                          src={categoryImage.imageUrl}
                          alt={category}
                          data-ai-hint={categoryImage.imageHint}
                          fill
                          className="object-cover"
                        />
                    )}
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative flex h-full items-center justify-center p-4">
                      <h3 className="text-center font-headline text-lg font-semibold text-white">
                        {category}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )})}
          </div>
        </div>
      </section>
      
      <section className="bg-card py-12 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold md:text-4xl">
            Featured Products
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
