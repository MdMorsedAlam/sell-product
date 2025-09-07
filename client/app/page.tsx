"use client";
import { useApi } from "@/hooks/useApi";
import { getImageUrl } from "@/hooks/useGetImage";
import { useAuth } from "@/providers/authProvider";
import { IProduct } from "@/types";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Home() {
    const { setTheme } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const [products, setProducts] = useState<IProduct[]>([]);
  const { data, isLoading, refetch } = useApi<IProduct[]>(
    ["products"],
    "/products"
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        await refetch();
        if (Array.isArray(data)) {
          setProducts(data);
        }
      } catch (error) {
        toast.error("Error fetching articles");
      }
    };
    fetchData();
  }, [data, isLoading]);
    useEffect(() => {
    setTheme("light");
  }, []);
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Header Bar */}
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div className="text-xl font-bold">Herbal Life</div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              {isAuthenticated ? (
                <Link href={`/${user?.role}/dashboard`}>Go To Dashboard</Link>
              ) : (
                <a href="/">Home</a>
              )}
            </li>
          </ul>
        </nav>
      </header>

      {/* Product Showcase Section */}
      <section id="products" className="p-4 md:p-8 bg-gray-100">
        <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}

          {products.map((product, i) => (
            <div
              key={i}
              className="bg-white shadow-lg rounded-lg p-6 text-center"
            >
              <img
                src={getImageUrl(product?.imageUrl)}
                alt={product?.name}
                className="w-full h-48 object-cover rounded-t-lg mb-4"
              />
              <h3 className="text-xl font-semibold">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.title}</p>
              <button className="bg-blue-500 text-white py-2 px-4 rounded-full">
                {product.name === "Haluwa" ? (
                  <Link href="/haluwa">View Haluwa</Link>
                ) : product.name === "Halwa Mohabbot" ? (
                  <Link href="/halwa-mohabbot">View Halwa Mohabbat</Link>
                ) : (
                  <Link href="/shefa">View Shefa</Link>
                )}
              </button>
            </div>
          ))}

          {/* Product 2 */}
          {/* <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img
              src="path-to-your-image"
              alt="Product 2"
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-semibold">Shefa Mixed</h3>
            <p className="text-gray-600 mb-4">Brief description of Product 2</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full">
              <Link href="/shefa">View Shefa</Link>
            </button>
          </div> */}

          {/* Product 3 */}
          {/* <div className="bg-white shadow-lg rounded-lg p-6 text-center">
            <img
              src="path-to-your-image"
              alt="Product 3"
              className="w-full h-48 object-cover rounded-t-lg mb-4"
            />
            <h3 className="text-xl font-semibold">Tin Neyamot</h3>
            <p className="text-gray-600 mb-4">Brief description of Product 3</p>
            <button className="bg-blue-500 text-white py-2 px-4 rounded-full">
              <Link href="/tin-neyamot">View Tin</Link>
            </button>
          </div> */}
        </div>
      </section>
    </main>
  );
}
