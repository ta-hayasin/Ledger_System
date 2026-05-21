#  Ledger Accounting System

A full-stack, web-based double-entry accounting system built with **Next.js**, **PostgreSQL**, and **Prisma ORM**. Designed for small to medium businesses to manage their accounts, record transactions, track inventory, and generate financial reports.

---

## Live Demo

🔗 [https://ledger-system-xi.vercel.app](https://ledger-system-xi.vercel.app)

---

##  Features

###  Authentication & User Management
- Secure login with hashed passwords (bcrypt)
- First registered user automatically becomes Admin
- Registration closed after admin is created
- Role-based access control (Admin, Accountant, Viewer)
- Admin can create and manage users

###  Company Management
- Set up company profile (name, address, phone, email, currency, tax number)
- Admin-only editing

###  Chart of Accounts (Ledgers)
- Create and manage ledger accounts
- Organized by account groups: Asset, Liability, Income, Expense
- Opening balance support (Debit/Credit)
- Admin-only management

###  Voucher Entry (Double-Entry Accounting)
- Record transactions with 6 voucher types:
  - Payment, Receipt, Sales, Purchase, Journal, Contra
- Automatic double-entry (Debit & Credit)
- Search and filter by date range, voucher type, and keyword
- Real-time transaction totals

###  Inventory Management
- Manage stock items with groups and units
- Track price and quantity
- Auto-calculated total stock value

###  Financial Reports
- **Trial Balance** — Verify debit/credit balance
- **Profit & Loss** — Income vs Expenses with Net Profit/Loss
- **Balance Sheet** — Assets vs Liabilities
- **Ledger Statement** — Transaction history for any ledger with running balance
- Export all reports to **Excel (.xlsx)**
- **Print / PDF** support for all reports

###  Dashboard
- Real-time stats (Companies, Vouchers, Ledgers)
- Income vs Expenses bar chart
- Asset Distribution pie chart
- Quick navigation to all modules

---

##  Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | PostgreSQL (Neon — Serverless) |
| ORM | Prisma 5 |
| Authentication | NextAuth.js v5 |
| Password Hashing | bcryptjs |
| Charts | Recharts |
| Excel Export | xlsx |
| Deployment | Vercel |

---

##  Database Schema

The system uses **11 tables** implementing full double-entry accounting:

```
users              — System users with roles
company            — Company profile
user_company       — User-Company relationship
account_groups     — Asset, Liability, Income, Expense
ledgers            — Chart of accounts
stock_groups       — Inventory categories
units              — Units of measurement
stock_items        — Inventory items
voucher_types      — Payment, Receipt, Sales, etc.
vouchers           — Transaction headers
voucher_entries    — Double-entry debit/credit lines
```

---

##  User Roles & Permissions

| Permission | Admin | Accountant | Viewer |
|---|---|---|---|
| View Dashboard & Reports | ✅ | ✅ | ✅ |
| View Ledgers & Vouchers | ✅ | ✅ | ✅ |
| Add/Delete Vouchers | ✅ | ✅ | ❌ |
| Add/Delete Inventory | ✅ | ✅ | ❌ |
| Add/Delete Ledgers | ✅ | ❌ | ❌ |
| Edit Company Details | ✅ | ❌ | ❌ |
| Manage Users | ✅ | ❌ | ❌ |
| Export Excel & Print | ✅ | ✅ | ✅ |

---

## Getting Started (Local Development)

### Prerequisites
- Node.js 20+ (via NVM recommended)
- Git
- A Neon PostgreSQL database (free at [neon.tech](https://neon.tech))

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ta-hayasin/Ledger_System.git
cd Ledger_System

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Add your DATABASE_URL and AUTH_SECRET to .env

# 4. Run database migrations
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"
AUTH_SECRET="your-super-secret-key-minimum-32-characters"
```

---

## 📁 Project Structure

```
my-app/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── auth/           # NextAuth handler
│   │   ├── company/        # Company CRUD
│   │   ├── ledgers/        # Ledgers CRUD
│   │   ├── vouchers/       # Vouchers CRUD
│   │   ├── inventory/      # Inventory CRUD
│   │   ├── reports/        # Report APIs
│   │   ├── users/          # User management
│   │   └── seed/           # Database seeding
│   ├── dashboard/          # Dashboard page
│   ├── company/            # Company page
│   ├── ledgers/            # Ledgers page
│   ├── vouchers/           # Vouchers page
│   ├── inventory/          # Inventory page
│   ├── reports/            # Reports pages
│   ├── users/              # User management page
│   ├── login/              # Login page
│   └── register/           # Register page
├── lib/                    # Utility files
│   ├── prisma.ts           # Prisma client
│   └── auth.ts             # NextAuth config
├── hooks/                  # Custom React hooks
│   └── useRole.ts          # Role-based access hook
├── prisma/                 # Prisma ORM
│   ├── schema.prisma       # Database schema
│   └── migrations/         # Migration files
└── public/                 # Static assets
```

---

## 🔒 Security Features

- **SQL Injection Prevention** — Prisma ORM uses parameterized queries for all database operations. No raw SQL is used anywhere in the codebase.
- **Password Hashing** — All passwords are hashed using bcrypt with salt rounds before storing in the database.
- **Session Management** — JWT-based sessions via NextAuth.js.
- **Role-Based Access Control** — API routes and UI elements are protected based on user roles.
- **Registration Control** — Public registration is disabled after the first admin account is created.

---

##  Screenshots

| Page | Description |
|---|---|
| Login | Secure login with email and password |
| Dashboard | Charts, stats and quick navigation |
| Ledgers | Chart of accounts organized by type |
| Vouchers | Transaction entry with search and filters |
| Reports | Trial Balance, P&L, Balance Sheet |

---

##  Deployment

This project is deployed on **Vercel** with **Neon PostgreSQL**.

To deploy your own instance:

1. Push code to GitHub
2. Import project on [vercel.com](https://vercel.com)
3. Add environment variables (`DATABASE_URL`, `AUTH_SECRET`)
4. Click Deploy

Every `git push` to main branch automatically redeploys the app.

---

## 📄 License

This project was built as a **Database Systems course project**.

---

##  Developer

**Taha Yasin** **Ahmed Mughal**
GitHub: [@ta-hayasin](https://github.com/ta-hayasin)

---

> Built using Next.js, Prisma, and PostgreSQL
