import PaginationControls from "../components/PaginationControls";
import ProductCard from "../components/ProductCard";


// Define types for the data we expect from the API
interface Product {
  _id: string;
  name: string;
  price: number;
  imageUrl: string;
}

interface ProductData {
  products: Product[];
  page: number;
  pages: number;
}

// Update the data fetching function to accept a page number
async function getProducts(page: number): Promise<{ data: ProductData | null; error: string | null }> {
  try {
    const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/products?page=${page}`;
    const res = await fetch(apiUrl, { cache: 'no-store' });

    if (!res.ok) throw new Error('Failed to fetch products');

    const data: ProductData = await res.json();
    return { data, error: null };
  } catch (err: any) {
    console.error('Failed to fetch products:', err);
    return { data: null, error: 'Could not load products. Please try again later.' };
  }
}

// The page component now accepts searchParams to get the current page
export default async function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const page = Number(searchParams.page) || 1;
  const { data, error } = await getProducts(page);

  if (error) {
    return <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>;
  }

  if (!data || data.products.length === 0) {
    return <p>No products found.</p>;
  }

  return (
   <div className="bg-transparent">
  <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
    
    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl mb-10">
      Latest Products
    </h2>

    <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>

    {/* The PaginationControls will need top margin to separate it from the grid */}
    {/* This will likely be handled inside the PaginationControls component itself */}
    <PaginationControls
      totalPages={data.pages}
      currentPage={data.page}
    />

  </div>
</div>
  );
}