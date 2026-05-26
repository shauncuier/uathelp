# 🚀 Quick Start Guide - UAT Help

**Get up and running in 5 minutes!**

---

## Prerequisites Checklist

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Firebase account created
- [ ] Git installed and configured
- [ ] Text editor/IDE (VS Code recommended)

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/uathelp.git
cd uathelp
```

---

## 2️⃣ Setup Firebase

### Get Firebase Credentials

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing one
3. Enable **Firestore Database** and **Authentication**
4. Go to **Project Settings** → **Service Accounts**
5. Click **Generate New Private Key**
6. Copy the JSON content

---

## 3️⃣ Configure Environment

### Create `.env.local`

```bash
# Copy from example
cp .env.local.example .env.local
```

### Fill in Firebase Details

Open `.env.local` and add your Firebase credentials:

```env
# Client SDK (Public)
NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Admin SDK (From the JSON file)
FIREBASE_PROJECT_ID="your-project-id"
FIREBASE_CLIENT_EMAIL="firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com"
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n[long key]\n-----END PRIVATE KEY-----\n"
FIREBASE_STORAGE_BUCKET="your-project.firebasestorage.app"
```

---

## 4️⃣ Install & Setup

### Install Dependencies
```bash
npm install
```

### Create Admin User
```bash
npx tsx scripts/create-admin.ts admin@uathelp.com "Password123!" "Admin Name"
```

### Seed Database (Optional)
```bash
node scripts/seed-simple.js
```

---

## 5️⃣ Start Development

### Run Development Server
```bash
npm run dev
```

### Open in Browser
Visit: **http://localhost:3000**

### Login
- Email: `admin@uathelp.com`
- Password: `Password123!`

---

## 📁 Key Directories

```
src/
├── app/              # Pages & routes
├── components/       # React components
├── lib/              # Utilities & Firebase
├── types/            # TypeScript types
├── context/          # React Context
├── schemas/          # Zod validation
└── hooks/            # Custom hooks
```

---

## 🛠️ Common Commands

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Linting
npm run lint         # Run ESLint

# Database
node scripts/seed-simple.js    # Seed data
npx tsx scripts/create-admin.ts [email] [password] [name]  # Create admin
```

---

## 🔗 Important Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Student homepage |
| Notices | `/notices` | Browse notices |
| Tips | `/tips` | Study tips & guides |
| Universities | `/universities` | Browse universities |
| Login | `/login` | Authentication |
| Admin | `/admin` | Admin dashboard |

---

## 📝 First Tasks

1. **Explore Home Page**: Visit `/` to see the hero, notices, and tips
2. **View a Notice**: Click any notice to see details
3. **Login as Admin**: Go to `/login` with admin credentials
4. **Create Notice**: In admin, create a new notice
5. **Update Settings**: Configure site settings

---

## 🐛 Troubleshooting

### Issue: "Firebase config not found"
**Solution**: Verify `.env.local` exists and has all Firebase keys

### Issue: "Admin user already exists"
**Solution**: Remove the user from Firebase Console and recreate

### Issue: "Firestore rules permission denied"
**Solution**: 
1. Go to Firebase Console
2. Firestore → Rules
3. Allow `allow read, write: if request.auth != null;` for testing

### Issue: Port 3000 already in use
**Solution**: 
```bash
npm run dev -- -p 3001
# Or kill process on port 3000
```

---

## 📚 Next Steps

1. Read [README.md](./README.md) for full documentation
2. Check [DEVELOPMENT_TASKS.md](./DEVELOPMENT_TASKS.md) for tasks
3. Explore [Project Structure](#-project-structure) in README
4. Start with Phase 1 tasks

---

## 💡 Tips

- **Use TypeScript**: Catch errors early with type checking
- **ESLint**: Check linting before committing
- **Commit Often**: Small, focused commits
- **Test Locally**: Always test before pushing
- **Read Errors**: Stack traces are your friend

---

## 🎯 Development Workflow

```
1. Create feature branch: git checkout -b feature/my-feature
2. Make changes
3. Run linter: npm run lint
4. Test locally: npm run dev
5. Commit: git commit -m "feat: description"
6. Push: git push origin feature/my-feature
7. Create Pull Request on GitHub
```

---

## 📞 Need Help?

- 📖 Check [README.md](./README.md)
- 🐛 Report issues on GitHub
- 💬 Ask in GitHub Discussions
- 📧 Email: support@uathelp.com

---

## ✅ Checklist for First Run

- [ ] Repository cloned
- [ ] Node.js installed
- [ ] Firebase project created
- [ ] `.env.local` configured
- [ ] Dependencies installed
- [ ] Admin user created
- [ ] Database seeded (optional)
- [ ] Dev server running
- [ ] Home page loads
- [ ] Can login as admin

---

**🎉 You're all set! Happy coding!**

---

Last Updated: May 27, 2026
