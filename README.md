
# 🍅 Tomato - Food Ordering Web Application

Tomato is a modern, full-stack food ordering web application. It allows users to browse a diverse menu, add items to their cart, and place orders seamlessly. The admin panel lets you manage products, track orders, and update order statuses efficiently.

---

## **Table of Contents**
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Folder Structure](#folder-structure)
- [Installation & Setup](#installation--setup)
- [Admin Panel](#admin-panel)
- [User Features](#user-features)
- [License](#license)

---

## **Features**
### **User Side**
- Browse food menu by categories.
- View product details including price, description, and image.
- Add products to the cart and manage quantities.
- Apply coupons for discounts.
- Place orders and pay via Stripe.
- Track order status after checkout.
- No COD Available

### **Admin Side**
- Add new products with images and descriptions.
- Delete or update existing products.
- Change the status of user orders (`Food Processing`, `Out for Delivery`, `Delivered`).
- Manage the complete product inventory.

---

## **Technologies Used**
- **Frontend:** React.js, CSS, React Router, React Context API  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB, Mongoose  
- **Authentication:** Firebase Authentication (Google Sign-In)  
- **Payment Gateway:** Stripe  
- **Image Hosting:** Cloudinary  
- **Deployment:** Vercel 

---

## **Folder Structure**
```

Tomato/
├── client/            # React frontend
│   ├── src/
│   │   ├── assets/    # Images, icons, frontend assets
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   └── pages/
│   └── package.json
├── server/            # Node.js backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   └── package.json
├── .gitignore
├── README.md
└── .env

````

---

## **Installation & Setup**
### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/tomato.git
cd tomato
````

### **2. Setup Backend**

```bash
cd server
npm install
cp .env.example .env   # Add your MongoDB URL, Stripe keys, Cloudinary keys
node seedProducts.js   # Seed initial food data
npm start              # Start backend server
```

### **3. Setup Frontend**

```bash
cd ../client
npm install
cp .env.example .env   # Add VITE_BASE_URL and Stripe key
npm run dev            # Start frontend development server
```

### **4. Open in Browser**

Visit [http://localhost:5173](http://localhost:5173) to access Tomato.

---

## **Admin Panel**

* Accessible only via admin credentials (Firebase authentication or your method).
* Can **Add / Update / Delete Products**.
* Can **Update Order Status** to manage deliveries.
* View all users’ orders and their current status.

---

## **User Features**

* Browse products by category.
* Add items to cart and adjust quantities.
* Apply coupons for discounts.
* Place orders and pay using Stripe.
* Track order status in real-time.

---

## **License**

This project is for educational purposes and personal use.
