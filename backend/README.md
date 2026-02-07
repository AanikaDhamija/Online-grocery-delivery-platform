# Backend (Node/Express + MongoDB)

Production-like backend API for the grocery app. Implements auth, addresses, loyalty, subscriptions, and orders with MongoDB persistence.

## Prerequisites
- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup
1. Install dependencies
	- In PowerShell:
	  ```powershell
	  cd "d:\5th Sem\Backend\Grocery-Delivery-Platform-Basket\backend"
	  npm install
	  ```
2. Configure environment in `.env` (optional — sensible defaults apply)
	- `MONGODB_URI=mongodb://127.0.0.1:27017/grocery_users`
	- `JWT_SECRET=your-long-random-secret`
3. Start the server
	```powershell
	npm start
	```
	Server runs at `http://localhost:3001`.

## Endpoints

Auth
- POST `/api/auth/signup` — body: `{ name, email, password }`
- POST `/api/auth/login` — body: `{ email, password }` → `{ token, user }`

Addresses
- GET `/api/addresses?userId=<mongoUserId>` → array of user addresses
- POST `/api/addresses` — body: address fields + `userId`

Loyalty
- GET `/api/loyalty/:userId` → `{ balance, history, tier }`

Orders
- POST `/api/orders/create` — body: `{ userId, totalAmount, pointsRedeemed }`

Subscriptions
- POST `/api/subscription` — body: `{ userId, plan, startDate|endDate, details: { items: [] } }`
- GET `/api/subscription/:userId` → list of subscriptions

## Notes
- For Windows, IPv4 loopback `127.0.0.1` is preferred in `MONGODB_URI`.
- The server starts even if Mongo is down, but will return 500 for DB-backed endpoints.

## Quick API tests (PowerShell)
```powershell
$signup = @{ name='Demo'; email='demo@example.com'; password='pass1234' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/signup' -Method POST -Body $signup -ContentType 'application/json'

$login = @{ email='demo@example.com'; password='pass1234' } | ConvertTo-Json
Invoke-RestMethod -Uri 'http://localhost:3001/api/auth/login' -Method POST -Body $login -ContentType 'application/json'
```
