import { useForm } from "react-hook-form";
import type { Product } from "../components/ProductCard";

interface AddEditProductModalProps {
  initialData?: Product | null;
  onSave: (product: Product) => void;
  onClose: () => void;
}

const AddEditProductModal = ({
  initialData,
  onSave,
  onClose,
}: AddEditProductModalProps) => {
  const { register, handleSubmit, reset } = useForm<Product>({
    defaultValues: initialData || {
      id: 0,
      name: "",
      category: "",
      supplier: "",
      quantity: 0,
      status: "In Stock",
    },
  });

  const onSubmit = (data: Product) => {
    const product = { ...data, id: initialData?.id || Date.now() };
    onSave(product);
    reset();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl dark:bg-gray-800 space-y-4"
      >
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {initialData ? "Edit Product" : "Add New Product"}
        </h3>

        <input
          {...register("name", { required: true })}
          placeholder="Product Name *"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="number"
          {...register("quantity")}
          placeholder="Quantity"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          {...register("category", { required: true })}
          placeholder="Category *"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          {...register("supplier", { required: true })}
          placeholder="Supplier *"
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        />
        <select
          {...register("status")}
          className="w-full px-3 py-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => {
              reset();
              onClose();
            }}
            className="flex-1 bg-gray-400 text-white py-2 rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProductModal;
