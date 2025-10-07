# 🔍 Veritas Investigations - Professional Online Detective Services

## 📖 Projekt Oversigt
Et komplet full-stack webapplikation bygget til professionel online detektivvirksomhed. Systemet håndterer kundehenvendelser, kontraktadministration, betalingssystemer og avancerede admin værktøjer.

---

## 🎯 Forretningsmodel
**Veritas Investigations** tilbyder diskret online detektivarbejde gennem:
- Catfish identifikation
- Utroskabsundersøgelser
- Baggrundstjek
- Svindelundersøgelser
- Digital fodaftryksanalyse
- Virksomhedsundersøgelser

### 🏢 Kunde segmenter:
- Privatpersoner (relationer, catfishing)
- Virksomheder (ansættelsestjek, due diligence)
- Retslige formål (bevisindsamling)

---

## 🛠️ Teknisk Stack

### Frontend
- **HTML5** + **CSS3** + **Vanilla JavaScript**
- **Bootstrap 5.3** - Responsivt design
- **Font Awesome 6.4** - Ikoner
- **Responsivt design** - Mobile-first

### Backend
- **Node.js** + **Express.js** - Server
- **MySQL** - Database (via XAMPP)
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Express Rate Limit** - API beskyttelse

### Database Schema
```sql
-- 3 hovedtabeller:
users (id, name, email, password, role, ip_address, ...)
contracts (id, contract_id, user_id, service_type, status, price, ...)
payments (id, contract_id, user_id, amount, payment_method, ...)

veritas-investigations/
├── 📁 config/
│   └── database.js              # MySQL connection
├── 📁 models/                   # Database models
│   ├── User.js                  # Brugerhåndtering
│   ├── Contract.js              # Kontraktsystem
│   └── Payment.js               # Betalingshåndtering
├── 📁 routes/                   # API endpoints
│   ├── auth.js                  # Authentication
│   ├── contracts.js             # Kontrakt management
│   ├── admin.js                 # Admin panel API
│   └── users.js                 # Brugerprofiler
├── 📁 middleware/
│   └── auth.js                  # JWT authentication
├── 📁 public/                   # Frontend filer
│   ├── index.html               # Hjemmeside
│   ├── login.html               # Login side
│   ├── register.html            # Registrering
│   ├── dashboard.html           # Bruger dashboard
│   ├── admin.html               # Admin panel
│   └── 📁 js/
│       └── app.js               # Frontend JavaScript
├── app.js                       # Main server fil
├── package.json                 # Dependencies
└── .env                         # Environment variables

🔐 Authentication System
Flow:
Registrering → Validering → Bruger oprettes → JWT token

Login → Email/password check → JWT token → Session

Authorization → Token validation → Role-based access

Security Features:
Password hashing med bcrypt (12 rounds)

JWT tokens med 30 dages expiry

IP tracking ved registrering

Rate limiting (100 requests/15min)

Helmet security headers

{
  contractId: "VRTS-1704739200000-ABC12",
  serviceType: "catfish|infidelity|background|fraud|digital|corporate|other",
  paymentMethod: "paypal|bitcoin|ethereum|other_crypto",
  targetInfo: "Detailed target information",
  clientName: "Kunde navn",
  clientEmail: "kunde@email.dk",
  anonymousService: false,
  price: 299, // Auto-calculated based on service
  status: "pending" // pending|approved|rejected|in-progress|completed
}

Prisstruktur:
Catfish Identification: $299

Infidelity Investigation: $499

Background Check: $199

Fraud Investigation: $399

Digital Footprint Analysis: $349

Corporate Investigation: $799

Other Service: $250

👑 Admin Panel Features
Dashboard:
Total users/contracts/revenue

Pending contracts counter

Recent activity feed

Revenue analytics

Contract Management:
Se alle kontrakter

Filter efter status

Approve/Reject kontrakter

Tilføj admin notes

Se bruger IP addresses

User Management:
Se alle brugere

IP address tracking

Registration dates

Role management (user/admin)

Revenue Analytics:
Total omsætning

Revenue per service type

Contract volume statistics

Monthly revenue trends

💰 Betalingssystem
Understøttede metoder:
PayPal - Traditionel betaling

Bitcoin - Anonym krypto

Ethereum - Anonym krypto

Other Cryptocurrency - Fleksibilitet

Payment Flow:
Kontrakt oprettes → Status: pending

Admin godkender → Status: approved

50% betaling forfalder → Payment status: paid

Arbejde påbegyndt → Status: in-progress

Arbejde afsluttet → Status: completed

🎨 Frontend Features
Responsiv Design:
Mobile-first approach

Bootstrap grid system

Professional color scheme:

Primary: #1a365d (Navy blue)

Secondary: #2d3748 (Dark gray)

Accent: #e53e3e (Red)

Side Struktur:
Forside - Services, FAQ, Testimonials

Login/Register - Brugerautentifikation

Dashboard - Brugerens kontrakter + ny kontrakt

Admin Panel - Komplet administrationsinterface

🚀 Installation & Opsætning
Forudsætninger:
Node.js (v14+)

XAMPP (MySQL + Apache)

Git

Installations Steps:
bash
# 1. Clone repository
git clone https://github.com/gastondige/a.git
cd a

# 2. Install dependencies
npm install

# 3. Database opsætning
# Start XAMPP → MySQL
# Opret database: veritas-investigations
# Import SQL schema fra database/ folder

# 4. Environment variables
cp .env.example .env
# Rediger .env med dine database oplysninger

# 5. Start server
npm run dev
# Server kører på http://localhost:3000
Database Opsætning:
Kør disse SQL queries i phpMyAdmin:

sql
CREATE DATABASE veritas-investigations;
USE veritas-investigations;

-- Se separate database.sql fil for komplet schema
-- Tabeller: users, contracts, payments
🔧 API Endpoints
Authentication:
POST /api/auth/register - Opret bruger

POST /api/auth/login - Login

GET /api/auth/me - Hent current user

Contracts:
POST /api/contracts - Opret kontrakt

GET /api/contracts/my-contracts - Brugerens kontrakter

GET /api/contracts/:id - Specifik kontrakt

Admin:
GET /api/admin/dashboard - Dashboard data

GET /api/admin/contracts - Alle kontrakter

PUT /api/admin/contracts/:id - Opdater kontrakt status

GET /api/admin/users - Alle brugere

GET /api/admin/revenue - Revenue analytics

Users:
PUT /api/users/profile - Opdater profil

PUT /api/users/change-password - Skift password

🎯 Nuværende Status
✅ FÆRDIGE FEATURES:
Bruger registrering/login

Kontrakt oprettelsessystem

Admin panel med godkendelse

User dashboard

Professionel frontend design

MySQL database integration

JWT authentication

Responsivt design

🚧 UNDER UDVIKLING:
PayPal integration

Cryptocurrency betalinger

Email notifikationer

File upload system

Live chat support

Advanced reporting

📋 TODO FEATURES:
Payment gateway integration

Automated email system

Contract document generation

Client communication portal

Advanced analytics dashboard

Multi-language support

Mobile app

🐛 Kendte Issues & Fixes
Issue 1: CSP (Content Security Policy) Errors
Problem: Helmet blokerer external resources
Fix: Opdater Helmet config i app.js:

javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "'unsafe-inline'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
      // ... flere directives
    }
  }
}));
Issue 2: Case Sensitivity
Problem: models/contract.js vs models/Contract.js
Fix: Konsistent brug af PascalCase for model filer

Issue 3: Async/Await i Models
Problem: Node.js version understøtter ikke async/await i visse kontekster
Fix: Brug callbacks i stedet for async/await

🔮 Fremtidig Udvikling
Phase 1 - Payment Integration
Integrer PayPal API

Cryptocurrency payment processors

Automated payment tracking

Phase 2 - Communication System
Internal messaging system

File sharing for evidence

Status update notifications

Phase 3 - Advanced Features
AI-powered analysis tools

Automated reporting generation

Client portal with real-time updates

Phase 4 - Scaling
Multi-tenant architecture

API for third-party integrations

Mobile application
