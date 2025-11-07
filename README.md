# Bootstrap E-Commerce System

A simple, full-stack e-commerce application built with Node.js, Express, MongoDB, and Bootstrap 5.

## Features

- ✅ Product management (CRUD operations)
- ✅ Shopping cart functionality
- ✅ Product search and category filtering
- ✅ Responsive Bootstrap 5 UI
- ✅ RESTful API architecture
- ✅ MongoDB database integration
- ✅ Session-based cart management
- ✅ Role-based authentication (JWT) with login & registration

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Mongoose** - MongoDB ODM
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **Bootstrap 5** - CSS framework
- **Bootstrap Icons** - Icon library
- **Vanilla JavaScript** - No framework dependencies

### Database
- **MongoDB** - NoSQL database

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)

### Steps

1. **Clone or download the project**
   ```bash
   cd semifinal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory with the following content:
   ```env
   # For local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/ecommerce
   
   # For MongoDB Atlas (replace with your credentials):
   # MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/ecommerce
   
   PORT=5000
    JWT_SECRET=change_this_secret
   ```

4. **Start MongoDB**
   - If using local MongoDB, make sure MongoDB service is running
   - If using MongoDB Atlas, ensure your connection string is correct

5. **Seed the database with sample products (optional)**
   ```bash
   npm run seed
   ```
   This will populate your database with 12 sample products across different categories.

6. **Start the server**
   ```bash
   npm start
   ```
   
   For development with auto-reload:
   ```bash
   npm run dev
   ```

7. **Access the application**
   - Open your browser and navigate to: `http://localhost:5000`

## API Endpoints

### Auth

- `POST /api/auth/register` - Register a new user (name, email, password, role)
- `POST /api/auth/login` - Authenticate user and receive JWT token

### Products

- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

**Query Parameters:**
- `?category=Electronics` - Filter by category
- `?search=laptop` - Search products by name or description

### Cart

- `GET /api/cart/:sessionId` - Get cart
- `POST /api/cart/:sessionId/items` - Add item to cart
- `PUT /api/cart/:sessionId/items/:itemId` - Update cart item quantity
- `DELETE /api/cart/:sessionId/items/:itemId` - Remove item from cart
- `DELETE /api/cart/:sessionId` - Clear cart

### Orders

- `POST /api/orders` - Create new order (requires customerName, customerEmail, sessionId)
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get single order by ID
- `GET /api/orders/customer/:email` - Get orders by customer email
- `PUT /api/orders/:id/status` - Update order status (pending, processing, completed, cancelled)

## Database Schema

### Product
```javascript
{
  name: String (required),
  description: String (required),
  price: Number (required, min: 0),
  image: String (default: placeholder),
  category: String (required),
  stock: Number (required, min: 0),
  rating: Number (min: 0, max: 5),
  createdAt: Date,
  updatedAt: Date
}
```

### Cart
```javascript
{
  sessionId: String (required, unique),
  items: [{
    productId: ObjectId (ref: Product),
    quantity: Number (required, min: 1),
    price: Number (required)
  }],
  total: Number (calculated),
  createdAt: Date,
  updatedAt: Date
}
```

### Order
```javascript
{
  orderNumber: String (unique, auto-generated),
  customerName: String (required),
  customerEmail: String (required, validated),
  sessionId: String (required),
  items: [{
    productId: ObjectId (ref: Product),
    productName: String (required),
    quantity: Number (required, min: 1),
    price: Number (required),
    subtotal: Number (required)
  }],
  subtotal: Number (required),
  tax: Number (required, default: 0),
  total: Number (required),
  status: String (enum: pending, processing, completed, cancelled),
  createdAt: Date,
  updatedAt: Date
}
```

### User
```javascript
{
  name: String (required),
  email: String (required, unique, validated),
  password: String (required, hashed, min length 6),
  role: String (enum: User, Admin, default: User),
  createdAt: Date,
  updatedAt: Date
}
```

## Seeding Sample Data

The project includes a seed script that populates the database with 12 sample products across different categories (Electronics, Clothing, Books, Home, Sports).

To seed the database:
```bash
npm run seed
```

Alternatively, you can add products manually using the API:

```javascript
// POST /api/products
{
  "name": "Laptop",
  "description": "High-performance laptop for work and gaming",
  "price": 999.99,
  "image": "https://via.placeholder.com/300x300?text=Laptop",
  "category": "Electronics",
  "stock": 10,
  "rating": 4.5
}
```

## Authentication Flow

1. Visit `register.html` to create a new account. Choose a role (`User` or `Admin`).
2. After registering, sign in via `login.html`. Successful login stores a JWT token and user profile in `localStorage`.
3. Navigation automatically switches to show the signed-in user and exposes role information. Use the profile dropdown to log out.
4. Authenticated state persists between sessions until the user logs out or storage is cleared.

## Project Structure

```
semifinal/
├── controller/
│   └── user.controller.js   # Auth controller
├── models/
│   ├── Product.js      # Product model
│   ├── Cart.js         # Cart model
│   └── Order.js        # Order model
├── routes/
│   ├── productRoutes.js # Product API routes
│   ├── cartRoutes.js    # Cart API routes
│   └── orderRoutes.js   # Order API routes
├── middleware/
│   ├── auth.middleware.js  # Authentication helper
│   └── upload.middleware.js # File upload helper
├── scripts/
│   └── seed.js         # Database seeding script
├── public/
│   ├── index.html      # Product listing page
│   ├── cart.html       # Shopping cart page
│   ├── login.html      # Login page
│   ├── register.html   # Registration page
│   ├── css/
│   │   └── style.css   # Custom styles
│   └── js/
│       ├── app.js      # Storefront logic
│       ├── auth.js     # Authentication forms logic
│       └── nav.js      # Shared navigation/auth state helpers
├── server.js           # Express server
├── package.json        # Dependencies
├── .env                # Environment variables (create this)
└── README.md           # This file
```

## Development

### Adding New Features

1. **Add new product fields**: Update `models/Product.js` schema
2. **Add new API endpoints**: Create routes in `routes/` directory
3. **Update frontend**: Modify HTML/JS files in `public/` directory

### Best Practices

- Use environment variables for sensitive data
- Validate input data on both client and server
- Handle errors gracefully
- Use meaningful variable and function names
- Comment complex logic

## Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running (if using local)
- Check connection string in `.env` file
- Verify network access (if using MongoDB Atlas)
- Check firewall settings

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port:
  ```bash
  # Windows
  netstat -ano | findstr :5000
  taskkill /PID <PID> /F
  
  # Linux/Mac
  lsof -ti:5000 | xargs kill
  ```

## License

ISC

## Author

Created with ❤️ for e-commerce development

