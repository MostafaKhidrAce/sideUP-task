interface FiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryChange: (value: string) => void;
  supplierFilter: string;
  onSupplierChange: (value: string) => void;
  categories: string[];
  suppliers: string[];
}

const Filters = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  supplierFilter,
  onSupplierChange,
  categories,
  suppliers,
}: FiltersProps) => (
  <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>
      <select
        value={categoryFilter}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>
      <select
        value={supplierFilter}
        onChange={(e) => onSupplierChange(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
      >
        <option value="">All Suppliers</option>
        {suppliers.map((sup) => (
          <option key={sup} value={sup}>
            {sup}
          </option>
        ))}
      </select>
    </div>
  </div>
);

export default Filters;
