# 📦 Inventory Management Dashboard

A modern inventory management dashboard built with **React**, **TypeScript**, **Tailwind CSS**, **React Router**, **React Hook Form**, and **React Toastify**. Supports **dark/light mode**, **drag-and-drop**, and **local data persistence**.

## 🌐 **[Live Demo](https://side-up-task.vercel.app/)**

## 🚀 Features

✅ **Authentication**

- Secure login with default credentials (`Username: sideup`, `Password: sideup`)
- Authentication state persists across reloads
- Logout button clears authentication and redirects to login

✅ **Inventory Management**

- View, add, edit, and delete products
- Drag and drop products between status columns (In Stock, Low Stock, Out of Stock)
- Real-time product status updates

✅ **Filters and Search**

- Filter by category, supplier, or search term
- Live updating of filtered products

✅ **Dark/Light Mode**

- Toggle between dark and light themes
- Dark mode preference persists across sessions

✅ **Import/Export Data**

- Import products from a JSON file
- Export current product list to JSON

✅ **Beautiful UI/UX**

- Fully responsive design with Tailwind CSS
- Animated gradient background on the login page
- React Toastify for elegant notifications

---

## 🛠️ Setup Instructions

1️⃣ **Clone the Repository**

```bash
git clone https://github.com/your-username/inventory-dashboard.git
cd inventory-dashboard
2️⃣ Install Dependencies

bash
Copy
Edit
npm install
3️⃣ Start the Development Server

bash
Copy
Edit

npm run dev

4️⃣ Open in Browser

Visit http://localhost:5173

📦 Packages Used
Package	Purpose
react & react-dom	Core UI framework
react-router-dom	Client-side routing
react-hook-form	Form handling
react-toastify	Toast notifications
lucide-react	Icon library
tailwindcss	Utility-first styling
typescript	Type safety
vite	Development server & build tool

💻 Functionality Overview

🔒 Authentication

Secure login form with default credentials.

Login state is stored in localStorage and persists across reloads.

Logout button in the dashboard clears auth and redirects to login.

🎨 Dark/Light Mode

Toggle between themes with a button in the header.

Preference is stored in localStorage and persists across sessions.

📦 Product Management

View product list grouped by stock status.

Drag and drop products between status columns.

Add/Edit/Delete products using React Hook Form.

Import/export product data as JSON files.

🔍 Filtering & Search

Filter products by category and supplier.

Search products by name.

📈 Real-time Updates

Live product status updates and animations when moving products.

🖼️ Beautiful Design

Animated gradient background on login.

Responsive, clean layout with Tailwind CSS.

Icons and UI components from lucide-react.
```
