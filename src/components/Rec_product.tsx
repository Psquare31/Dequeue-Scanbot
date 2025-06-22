import { useCartStore } from '../store/useCartStore';

const products = [
  { id: "1", name: "BMW M5", image_url: "https://www.xbhp.com/machines/wp-content/uploads/2023/05/BMW-M5-Competition-1-1024x683.jpg", price: 100000, barcode: "111111" },
  { id: "2", name: "Product 2", image_url: "https://www.xbhp.com/machines/wp-content/uploads/2023/05/BMW-M5-Competition-1-1024x683.jpg", price: 150000, barcode: "222222" },
  { id: "3", name: "Product 3", image_url: "https://www.xbhp.com/machines/wp-content/uploads/2023/05/BMW-M5-Competition-1-1024x683.jpg", price: 200000, barcode: "333333" },
  { id: "4", name: "Product 4", image_url: "https://www.xbhp.com/machines/wp-content/uploads/2023/05/BMW-M5-Competition-1-1024x683.jpg", price: 250000, barcode: "444444" },
  { id: "5", name: "Product 5", image_url: "https://www.xbhp.com/machines/wp-content/uploads/2023/05/BMW-M5-Competition-1-1024x683.jpg", price: 300000, barcode: "555555" },
];

const Rec_product = () => {
  const { addItem } = useCartStore();

  return (
    <div className="my-6 bg-transparent py-6 px-4">
      <h2 className="text-xl font-semibold mb-4">Recommended Products</h2>
      <div className="flex overflow-x-auto gap-4 pb-2 hide-scrollbar">
        {products.map((product) => (
          <div
            key={product.id}
            className="min-w-[160px] bg-white rounded-lg shadow-md p-3 flex-shrink-0"
          >
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-24 object-cover rounded-md"
            />
            <div className="mt-2 font-medium text-center">{product.name}</div>
            <div className="text-gray-500 text-sm text-center">${product.price}</div>
            <button
              className="mt-2 w-full bg-blue-600 text-white text-sm px-3 py-1 rounded hover:bg-blue-700 transition duration-200"
              onClick={() => addItem(product)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rec_product;
