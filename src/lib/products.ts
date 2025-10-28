import type { Product, Category } from '@/lib/definitions';

const products: Product[] = [
  { id: 'hp-01', name: 'Elegant Haldi Platter', description: 'A beautifully decorated platter for your haldi ceremony, adorned with pearls and flowers.', price: 45, category: 'Haldi Platters', imageId: 'haldi-platter-1', customization: ['Color scheme', 'Flower type'] },
  { id: 'hp-02', name: 'Traditional Haldi Platter', description: 'Embrace tradition with this platter featuring classic gota patti work and ethnic motifs.', price: 50, category: 'Haldi Platters', imageId: 'haldi-platter-2', customization: ['Add names', 'Change fabric'] },
  { id: 'hp-03', name: 'Floral Haldi Platter', description: 'A fresh and vibrant platter covered in artificial marigolds and jasmine.', price: 40, category: 'Haldi Platters', imageId: 'haldi-platter-3', customization: ['Real flowers (extra cost)', 'Add fairy lights'] },
  { id: 'hp-04', name: 'Custom Haldi Platter', description: 'A personalized haldi platter designed to your specifications.', price: 60, category: 'Haldi Platters', imageId: 'haldi-platter-4', customization: ['Full design consultation'] },
  { id: 'mp-01', name: 'Vibrant Mehndi Platter', description: 'A colorful platter for your mehndi night, perfect for holding henna cones and accessories.', price: 55, category: 'Mehndi Platters', imageId: 'mehndi-platter-1', customization: ['Tassel colors', 'Add bangles'] },
  { id: 'mp-02', name: 'Peacock Mehndi Platter', description: 'An exquisite platter with a peacock theme, using rich blues and greens.', price: 65, category: 'Mehndi Platters', imageId: 'mehndi-platter-2', customization: ['Feather type', 'Add crystals'] },
  { id: 'mp-03', name: 'Artisan Mehndi Platter', description: 'Hand-painted by local artisans, this platter is a true work of art.', price: 70, category: 'Mehndi Platters', imageId: 'mehndi-platter-3', customization: ['Custom painting subject'] },
  { id: 'mp-04', name: 'Mirror Work Mehndi Platter', description: 'A dazzling platter decorated with intricate mirror work that shines.', price: 60, category: 'Mehndi Platters', imageId: 'mehndi-platter-4', customization: ['Mirror shapes', 'Ghungroo bells'] },
  { id: 'ea-01', name: 'Feather Engagement Pen', description: 'A glamorous pen for signing your engagement papers, decorated with a large feather.', price: 25, category: 'Engagement Accessories', imageId: 'engagement-pen-1', customization: ['Feather color', 'Ink color'] },
  { id: 'ea-02', name: 'Crystal Engagement Pen', description: 'An elegant pen covered in sparkling crystals.', price: 30, category: 'Engagement Accessories', imageId: 'engagement-pen-2', customization: ['Crystal colors', 'Engraved names'] },
  { id: 'rp-01', name: 'Luxurious Ring Platter', description: 'A stunning platter to present the engagement rings, featuring space for two rings.', price: 75, category: 'Ring Platters', imageId: 'ring-platter-1', customization: ['Ring holder style', 'Add initials'] },
  { id: 'rp-02', name: 'Velvet Ring Platter', description: 'A plush velvet platter for a soft and royal touch.', price: 65, category: 'Ring Platters', imageId: 'ring-platter-2', customization: ['Velvet color', 'Embroidery'] },
  { id: 'rp-03', name: 'Personalized Ring Platter', description: 'Features a laser-cut design with the couple\'s names and engagement date.', price: 80, category: 'Ring Platters', imageId: 'ring-platter-3', customization: ['Font style', 'Design motif'] },
  { id: 'h-01', name: 'Wedding Gift Hamper', description: 'A curated hamper with organic sweets, scented candles, and small handmade gifts.', price: 120, category: 'Hampers', imageId: 'hamper-1', customization: ['Select items', 'Custom message card'] },
  { id: 'h-02', name: 'Bridesmaid Hamper', description: 'A special hamper to propose to your bridesmaids, with personalized goodies.', price: 85, category: 'Hampers', imageId: 'hamper-2', customization: ['Personalized robe', 'Scent choices'] },
  { id: 'h-03', name: 'Groom\'s Gift Hamper', description: 'A sophisticated hamper for the groom with grooming essentials and treats.', price: 95, category: 'Hampers', imageId: 'hamper-3', customization: ['Add a custom tie', 'Whiskey stones'] },
  { id: 'h-04', name: 'Organic Spa Hamper', description: 'Relax before the big day with this hamper of organic soaps, bath bombs, and lotions.', price: 75, category: 'Hampers', imageId: 'hamper-4', customization: ['Essential oil scents'] },
  { id: 'np-01', name: 'Ornate Nikah Pen', description: 'A traditionally designed pen, perfect for the Nikah ceremony.', price: 35, category: 'Nikah Pens', imageId: 'nikah-pen-1', customization: ['Engraving', 'Tassel color'] },
  { id: 'np-02', name: 'Golden Nikah Pen', description: 'A beautiful golden pen that adds a touch of luxury to your signing.', price: 40, category: 'Nikah Pens', imageId: 'nikah-pen-2', customization: ['Gold finish (matte/shiny)'] },
  { id: 'np-03', name: 'Pearl Nikah Pen', description: 'An elegant pen decorated with delicate pearls.', price: 38, category: 'Nikah Pens', imageId: 'nikah-pen-3', customization: ['Pearl size and color'] },
  { id: 'rg-01', name: 'Potli Bag Return Gifts', description: 'Set of 10 beautiful potli bags, ideal for filling with treats as return gifts.', price: 50, category: 'Return Gifts', imageId: 'return-gift-1', customization: ['Fabric choice', 'Drawstring type'] },
  { id: 'rg-02', name: 'Handmade Soap Return Gifts', description: 'Pack of 20 organic, handmade soaps in various scents.', price: 60, category: 'Return Gifts', imageId: 'return-gift-2', customization: ['Choose scents', 'Custom labels'] },
  { id: 'di-01', name: 'Hand-painted Diya Set', description: 'Set of 4 hand-painted clay diyas for festive decor.', price: 20, category: 'Decor', imageId: 'decor-item-1', customization: ['Color palette'] },
  { id: 'di-02', name: 'T-light Candle Holders', description: 'Set of 6 decorative t-light holders to brighten up any space.', price: 30, category: 'Decor', imageId: 'decor-item-2', customization: ['Design pattern'] },
  { id: 'di-03', name: 'Floral Wall Hanging', description: 'A beautiful wall hanging made with artificial flowers and hoops.', price: 45, category: 'Decor', imageId: 'decor-item-3', customization: ['Flower types', 'Hoop size'] },
];

export function getProducts(category?: string, query?: string): Product[] {
  let filteredProducts = products;
  
  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (query) {
    const lowerCaseQuery = query.toLowerCase();
    filteredProducts = filteredProducts.filter(
      p => 
        p.name.toLowerCase().includes(lowerCaseQuery) || 
        p.description.toLowerCase().includes(lowerCaseQuery)
    );
  }

  return filteredProducts;
}

export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

export function getCategories(): Category[] {
  return Array.from(new Set(products.map(p => p.category)));
}
