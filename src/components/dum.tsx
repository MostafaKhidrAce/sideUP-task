import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Edit,
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Home,
  BarChart3,
  Settings,
  Users,
  Plus,
  Download,
  Upload,
  Trash2,
  Menu,
  X,
  Moon,
  Sun,
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  category: string;
  quantity: number;
  supplier: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
}

const InventoryDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

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

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem("inventory-products");
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [supplierFilter, setSupplierFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>({
    name: "",
    category: "",
    quantity: 0,
    supplier: "",
    status: "In Stock",
  });
  const [animatingProducts, setAnimatingProducts] = useState<Set<number>>(
    new Set()
  );

  const categories = [...new Set(products.map((p) => p.category))];
  const suppliers = [...new Set(products.map((p) => p.supplier))];

  // Initialize dark mode and fade-in effect
  useEffect(() => {
    // Check user's preferred color scheme
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    setDarkMode(prefersDark);

    // Set fade-in animation
    setIsLoaded(true);

    // Apply dark mode class to body
    if (prefersDark) {
      document.body.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
  };

  // Save to localStorage whenever products change
  useEffect(() => {
    localStorage.setItem("inventory-products", JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    let filtered = products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        !categoryFilter || product.category === categoryFilter;
      const matchesSupplier =
        !supplierFilter || product.supplier === supplierFilter;
      return matchesSearch && matchesCategory && matchesSupplier;
    });
    setFilteredProducts(filtered);
  }, [products, searchTerm, categoryFilter, supplierFilter]);

  const handleDragStart = (e: React.DragEvent, product: Product) => {
    e.stopPropagation();
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", product.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, newStatus: Product["status"]) => {
    e.preventDefault();
    const productId = parseInt(e.dataTransfer.getData("text/plain"), 10);
    const product = products.find((p) => p.id === productId);

    if (product && product.status !== newStatus) {
      setAnimatingProducts((prev) => new Set([...prev, product.id]));

      setTimeout(() => {
        setProducts((prev) =>
          prev.map((p) =>
            p.id === product.id
              ? {
                  ...p,
                  status: newStatus,
                  quantity: getQuantityByStatus(newStatus),
                }
              : p
          )
        );

        setTimeout(() => {
          setAnimatingProducts((prev) => {
            const newSet = new Set(prev);
            newSet.delete(product.id);
            return newSet;
          });
        }, 300);
      }, 100);
    }
  };

  const getQuantityByStatus = (status: Product["status"]): number => {
    switch (status) {
      case "In Stock":
        return Math.floor(Math.random() * 40) + 20;
      case "Low Stock":
        return Math.floor(Math.random() * 5) + 1;
      case "Out of Stock":
        return 0;
      default:
        return 0;
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSave = () => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      );
      setEditingProduct(null);
    }
  };

  const addNewProduct = () => {
    if (newProduct.name && newProduct.category && newProduct.supplier) {
      const product: Product = {
        ...newProduct,
        id: Date.now(),
        quantity: parseInt(newProduct.quantity.toString()) || 0,
      };
      setProducts((prev) => [...prev, product]);
      setNewProduct({
        name: "",
        category: "",
        quantity: 0,
        supplier: "",
        status: "In Stock",
      });
      setShowAddForm(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory-data.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(
            e.target?.result as string
          ) as Product[];
          setProducts(importedData);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
    // Reset the input value to allow re-uploading the same file
    event.target.value = "";
  };

  const clearData = () => {
    if (confirm("Are you sure you want to clear all data?")) {
      setProducts([]);
      localStorage.removeItem("inventory-products");
    }
  };

  const resetToDefault = () => {
    if (confirm("Reset to default sample data?")) {
      setProducts(initialProducts);
    }
  };

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

  const getStatusBadge = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    }
  };

  const getColumnStyle = (status: Product["status"]) => {
    switch (status) {
      case "In Stock":
        return "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/30";
      case "Low Stock":
        return "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/30";
      case "Out of Stock":
        return "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/30";
      default:
        return "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/30";
    }
  };

  const ProductCard = ({ product }: { product: Product }) => {
    const isAnimating = animatingProducts.has(product.id);

    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, product)}
        className={`
          bg-white border border-gray-200 rounded-lg p-4 cursor-move shadow-sm
          hover:shadow-md transition-all duration-200 hover:border-gray-300
          ${isAnimating ? "animate-pulse ring-2 ring-blue-500" : ""}
          dark:bg-gray-800 dark:border-gray-700 dark:hover:border-gray-600
        `}
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
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            handleEdit(product);
          }}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-3 rounded text-xs
                   transition-colors duration-200 flex items-center justify-center gap-1
                   dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300"
        >
          <Edit className="w-3 h-3" />
          Edit
        </button>
      </div>
    );
  };

  const Sidebar = () => (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 
      ${sidebarOpen ? "w-64" : "w-16"}
      dark:bg-gray-900 dark:border-gray-800`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-5 h-5 text-white" />
          </div>
          {sidebarOpen && (
            <h1 className="font-bold text-gray-900 dark:text-white">
              SideUP-Dashboard
            </h1>
          )}
        </div>
      </div>

      <nav className="p-4 space-y-2">
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg
                     dark:text-blue-400 dark:bg-blue-900/30"
        >
          <Home className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Dashboard</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors
                     dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <BarChart3 className="w-5 h-5" />
          {sidebarOpen && <span>Analytics</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors
                     dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <Users className="w-5 h-5" />
          {sidebarOpen && <span>Suppliers</span>}
        </a>
        <a
          href="#"
          className="flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors
                     dark:text-gray-400 dark:hover:bg-gray-800"
        >
          <Settings className="w-5 h-5" />
          {sidebarOpen && <span>Settings</span>}
        </a>
      </nav>
    </div>
  );

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300 ${
        isLoaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
    >
      <Sidebar />

      <div
        ref={mainRef}
        className={`transition-all duration-300 ${
          sidebarOpen ? "ml-64" : "ml-16"
        }`}
      >
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 dark:bg-gray-900 dark:border-gray-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors dark:hover:bg-gray-800"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Inventory Dashboard
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label={
                  darkMode ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {darkMode ? (
                  <Sun className="w-5 h-5 text-yellow-400" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-700" />
                )}
              </button>

              {/* Data Management Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddForm(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  Add Product
                </button>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="w-4 h-4" />
                  Export
                </button>
                <label className="flex items-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm cursor-pointer">
                  <Upload className="w-4 h-4" />
                  Import
                  <input
                    type="file"
                    accept=".json"
                    onChange={importData}
                    className="hidden"
                  />
                </label>
                <button
                  onClick={resetToDefault}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Reset
                </button>
                <button
                  onClick={clearData}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <Trash2 className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Total Products
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {products.length}
                  </p>
                </div>
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    In Stock
                  </p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {products.filter((p) => p.status === "In Stock").length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Low Stock
                  </p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {products.filter((p) => p.status === "Low Stock").length}
                  </p>
                </div>
                <TrendingDown className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Out of Stock
                  </p>
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {products.filter((p) => p.status === "Out of Stock").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6 dark:bg-gray-800 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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
                onChange={(e) => setSupplierFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                           dark:bg-gray-700 dark:border-gray-600 dark:text-white"
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

          {/* Kanban Board */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {["In Stock", "Low Stock", "Out of Stock"].map((status) => (
              <div
                key={status}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status as Product["status"])}
                className={`${getColumnStyle(status as Product["status"])} 
                rounded-lg border-2 border-dashed p-4 min-h-[500px] transition-all duration-200`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(status as Product["status"])}
                    <h2 className="font-semibold text-gray-900 dark:text-white">
                      {status}
                    </h2>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusBadge(
                      status as Product["status"]
                    )}`}
                  >
                    {filteredProducts.filter((p) => p.status === status).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {filteredProducts
                    .filter((product) => product.status === status)
                    .map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">
              Add New Product
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={newProduct.name}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Enter product name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Category *
                </label>
                <input
                  type="text"
                  value={newProduct.category}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Electronics, Furniture, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Supplier *
                </label>
                <input
                  type="text"
                  value={newProduct.supplier}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, supplier: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Supplier name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Status
                </label>
                <select
                  value={newProduct.status}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      status: e.target.value as Product["status"],
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={addNewProduct}
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Add Product
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setNewProduct({
                    name: "",
                    category: "",
                    quantity: 0,
                    supplier: "",
                    status: "In Stock",
                  });
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors
                           dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl dark:bg-gray-800">
            <h3 className="text-xl font-bold text-gray-900 mb-4 dark:text-white">
              Edit Product
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Product Name
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Quantity
                </label>
                <input
                  type="number"
                  value={editingProduct.quantity}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      quantity: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Category
                </label>
                <input
                  type="text"
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 dark:text-gray-300">
                  Supplier
                </label>
                <input
                  type="text"
                  value={editingProduct.supplier}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      supplier: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
                             dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors
                           dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InventoryDashboard;
