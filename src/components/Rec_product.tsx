import { useCartStore } from '../store/useCartStore';
import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_HOST_URL_Rec;

// Verify recommender system
const Rec_product = () => {
  const { addItem } = useCartStore();
  const { user, isAuthenticated, isLoading } = useAuth0();
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_BASE_URL}/api/recommendations/${encodeURIComponent(userId)}`);
      if (!res.ok) throw new Error('Failed to fetch recommendations');
      const data = await res.json();
      setRecommendations(data.data?.recommendations || []);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const sub = user?.sub;
    if (!isAuthenticated || typeof sub !== 'string') {
      setLoading(false);
      setRecommendations([]);
      return;
    }
    fetchRecommendations(sub);
  }, [isAuthenticated, user]);

  if (isLoading) {
    return <div className="text-center text-gray-500">Loading user...</div>;
  }

  const handleAddItem = async (product: any) => {
    if (user && user.sub) {
      await addItem(product, user.sub, user.name, user.email);
      await fetchRecommendations(user.sub);
    } else {
      await addItem(product);
    }
  };

  return (
    <div className="my-6 bg-transparent py-6 px-4">
      <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
      {loading ? (
        <div className="text-center text-gray-500">Loading recommendations...</div>
      ) : error ? (
        <div className="text-center text-red-500">{error}</div>
      ) : !isAuthenticated ? (
        <div className="text-center text-gray-500">Please log in to see recommendations.</div>
      ) : (
        <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
          {recommendations.map((product) => (
            <div
              key={product.productId}
              className="min-w-[160px] bg-white rounded-lg shadow-md p-3 flex-shrink-0"
            >
              {/* Placeholder image if not available */}
              <img
                src={product.image_url || 'https://via.placeholder.com/160x96?text=No+Image'}
                alt={product.name}
                className="w-full h-24 object-cover rounded-md"
              />
              <div className="mt-2 font-medium text-center">{product.name}</div>
              <div className="text-gray-500 text-sm text-center">${product.price}</div>
              <div className="text-xs text-yellow-600 text-center">Rating: {product.rating}</div>
              <button
                className="mt-2 w-full bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
                onClick={() => handleAddItem(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Rec_product;
