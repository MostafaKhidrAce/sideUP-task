import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import type { Product } from "../components/ProductCard";
import AddEditProductModal from "../components/AddEditProductModal";

const initialProducts: Product[] = [
  {
    id: 1,
    name: "iPhone 15 Pro",
    category: "Electronics",
    quantity: 25,
    supplier: "Apple Inc",
    status: "In Stock",
  },
  {
    id: 2,
    name: "MacBook Air M3",
    category: "Electronics",
    quantity: 8,
    supplier: "Apple Inc",
    status: "Low Stock",
  },
  {
    id: 3,
    name: "Gaming Chair",
    category: "Furniture",
    quantity: 0,
    supplier: "Herman Miller",
    status: "Out of Stock",
  },
  {
    id: 4,
    name: "Wireless Mouse",
    category: "Electronics",
    quantity: 45,
    supplier: "Logitech",
    status: "In Stock",
  },
  {
    id: 5,
    name: "Standing Desk",
    category: "Furniture",
    quantity: 3,
    supplier: "IKEA",
    status: "Low Stock",
  },
  {
    id: 6,
    name: "Monitor 4K",
    category: "Electronics",
    quantity: 0,
    supplier: "Samsung",
    status: "Out of Stock",
  },
  {
    id: 7,
    name: "Coffee Maker",
    category: "Appliances",
    quantity: 15,
    supplier: "Breville",
    status: "In Stock",
  },
  {
    id: 8,
    name: "Air Purifier",
    category: "Appliances",
    quantity: 2,
    supplier: "Dyson",
    status: "Low Stock",
  },
];

const DashboardPage = ({ onLogout }: { onLogout: () => void }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("inventory-products");
    return saved ? JSON.parse(saved) : initialProducts;
  });
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("dark-mode") === "true";
  });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [animatingProducts, setAnimatingProducts] = useState(new Set<number>());

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const categories = [...new Set(products.map((p) => p.category))];
  const suppliers = [...new Set(products.map((p) => p.supplier))];

  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    const filtered = products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (!categoryFilter || p.category === categoryFilter) &&
        (!supplierFilter || p.supplier === supplierFilter)
    );
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, supplierFilter]);

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.dataTransfer.setData("text/plain", product.id.toString());
  };

  const handleDrop = (e: React.DragEvent, newStatus: Product["status"]) => {
    e.preventDefault();
    const productId = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const product = products.find((p) => p.id === productId);
    if (product && product.status !== newStatus) {
      setAnimatingProducts((prev) => new Set(prev).add(product.id));
      setTimeout(() => {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id ? { ...p, status: newStatus } : p
          )
        );
        setAnimatingProducts((prev) => {
          const updated = new Set(prev);
          updated.delete(product.id);
          return updated;
        });
      }, 300);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const newMode = !prev;
      localStorage.setItem("dark-mode", JSON.stringify(newMode));
      if (newMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return newMode;
    });
  };

  const getColumnStyle = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "border-green-200 bg-green-50 dark:border-green-600 dark:bg-green-900/30";
      case "Low Stock":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-600 dark:bg-yellow-900/30";
      case "Out of Stock":
        return "border-red-200 bg-red-50 dark:border-red-600 dark:bg-red-900/30";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30";
    }
  };

  return (
    <div className="min-h-screen flex">
      <Sidebar sidebarOpen={sidebarOpen} />
      <div
        className={`flex-1 ${
          sidebarOpen ? "ml-64" : "ml-16"
        } transition-all duration-300`}
      >
        <Header
          sidebarOpen={sidebarOpen}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
          onAddProduct={() => setShowAddForm(true)}
          onExport={() => {
            const blob = new Blob([JSON.stringify(products, null, 2)], {
              type: "application/json",
            });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "inventory.json";
            a.click();
            URL.revokeObjectURL(url);
          }}
          onImport={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              const reader = new FileReader();
              reader.onload = (e) => {
                try {
                  const data = JSON.parse(e.target?.result as string);
                  setProducts(data);
                } catch {
                  alert("Invalid file");
                }
              };
              reader.readAsText(file);
            }
          }}
          onReset={() => setProducts(initialProducts)}
          onClear={() => {
            setProducts([]);
            localStorage.removeItem("inventory-products");
          }}
          onLogout={onLogout}
        />
        <main className="p-6">
          <Filters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            supplierFilter={supplierFilter}
            onSupplierChange={setSupplierFilter}
            categories={categories}
            suppliers={suppliers}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {["In Stock", "Low Stock", "Out of Stock"].map((status) => (
              <div
                key={status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, status as Product["status"])}
                className={`border-dashed border-2 p-4 rounded-lg min-h-[500px] ${getColumnStyle(
                  status as Product["status"]
                )}`}
              >
                <h2 className="font-semibold text-lg">{status}</h2>
                <div className="space-y-2">
                  {filteredProducts
                    .filter((p) => p.status === status)
                    .map((p) => (
                      <ProductCard
                        key={p.id}
                        product={p}
                        isAnimating={animatingProducts.has(p.id)}
                        onDragStart={handleDragStart}
                        onEdit={setEditingProduct}
                      />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
      {showAddForm && (
        <AddEditProductModal
          onSave={(p) => {
            setProducts((prev) => [...prev, p]);
            setShowAddForm(false);
          }}
          onClose={() => setShowAddForm(false)}
        />
      )}
      {editingProduct && (
        <AddEditProductModal
          initialData={editingProduct}
          onSave={(p) => {
            setProducts((prev) =>
              prev.map((prod) => (prod.id === p.id ? p : prod))
            );
            setEditingProduct(null);
          }}
          onClose={() => setEditingProduct(null)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
