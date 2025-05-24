import {
  Edit,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
} from "lucide-react";

export interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

interface ProductCardProps {
  product: Product;
  isAnimating: boolean;
  onDragStart: (e: React.DragEvent, product: Product) => void;
  onEdit: (product: Product) => void;
}

const getStatusIcon = (status: Product["status"]) => {
  switch (status) {
    case "In Stock":
      return (
        <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    case "Low Stock":
      return (
        <TrendingDown className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      );
    case "Out of Stock":
      return (
        <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
      );
    default:
      return <Package className="w-4 h-4" />;
  }
};

const ProductCard = ({
  product,
  isAnimating,
  onDragStart,
  onEdit,
}: ProductCardProps) => (
  <div
    draggable
    onDragStart={(e) => onDragStart(e, product)}
    className={`bg-white border border-gray-200 rounded-lg p-4 cursor-move shadow-sm hover:shadow-md transition-all duration-200 hover:border-gray-300 ${
      isAnimating ? "animate-pulse ring-2 ring-blue-500" : ""
    } dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600`}
  >
    <div className="flex justify-between items-start mb-3">
      <div>
        <h3 className="font-semibold text-gray-900 text-sm dark:text-white">
          {product.name}
        </h3>
        <p className="text-gray-600 text-xs mt-1 dark:text-gray-400">
          {product.category}
        </p>
      </div>
      {getStatusIcon(product.status)}
    </div>
    <div className="space-y-2 mb-3">
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">Qty:</span>
        <span className="font-medium text-gray-900 dark:text-white">
          {product.quantity}
        </span>
      </div>
      <div className="flex justify-between text-xs">
        <span className="text-gray-500 dark:text-gray-400">Supplier:</span>
        <span className="font-medium text-gray-700 truncate ml-2 dark:text-gray-300">
          {product.supplier}
        </span>
      </div>
    </div>
    <button
      onClick={() => onEdit(product)}
      className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded text-xs transition-colors duration-200 flex items-center justify-center gap-1 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300"
    >
      <Edit className="w-3 h-3" /> Edit
    </button>
  </div>
);

export default ProductCard;
