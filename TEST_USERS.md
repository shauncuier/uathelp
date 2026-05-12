# Test Users - UAT Help Platform

## Quick Access

Use these credentials to test the UAT Help platform locally or in development environments.

### 👨‍🎓 Student Users

#### Student 1 - Standard User
```
Email: student1@test.com
Password: TestPass123!
Name: Rafiq Ahmed
Role: student
```
**Profile**: Physics student interested in BUET and engineering universities.

#### Student 2 - Medical Aspirant
```
Email: student2@test.com
Password: TestPass123!
Name: Fatima Khan
Role: student
```
**Profile**: Pre-medical student exploring medical college options.

#### Student 3 - Commerce Student
```
Email: student3@test.com
Password: TestPass123!
Name: Ali Hassan
Role: student
```
**Profile**: Commerce student interested in business and management programs.

### 👨‍💼 Admin Users

#### Admin - Full Access
```
Email: admin@test.com
Password: AdminPass123!
Name: Admin User
Role: admin
```
**Access**: Complete platform management
- View all users
- Manage universities database
- Create and publish blog posts
- Post admission circulars
- View analytics
- System settings

#### Moderator - Limited Access
```
Email: moderator@test.com
Password: ModPass123!
Name: Moderator User
Role: moderator
```
**Access**: Content moderation
- Review user-generated content
- Manage circulars
- Moderate comments
- Basic analytics

---

## Testing Flows

### 1. Student Sign-Up & Onboarding
1. Go to `/signup`
2. Register with a new email (e.g., `testuser@example.com`)
3. Complete email verification
4. Fill in academic profile
5. Explore dashboard

### 2. University Search
1. Navigate to `/universities`
2. Search for "BUET" or "Dhaka"
3. Filter by type: Engineering, Public
4. Sort by ranking
5. Click on a university to view details
6. Save university to dashboard

### 3. AI Chatbot Testing
1. Go to `/chat`
2. Try these prompts:
   - "Which university is best for Engineering?"
   - "How do I apply to DU?"
   - "What are the admission requirements?"
   - "Tell me about scholarship opportunities"
3. Test chat history and message copying

### 4. Blog & Guides
1. Navigate to `/blog`
2. Browse featured post
3. Read "Complete University Admission Guide 2026"
4. Filter by category: Guide, Rankings, Scholarships
5. Search for topics

### 5. Dashboard Features
1. Login with student credentials
2. View stats cards
3. Check upcoming deadlines
4. Review recent activity
5. Access quick actions
6. Navigate to saved universities

### 6. Admin Dashboard
1. Login with admin credentials (admin@test.com)
2. View platform statistics
3. Check recent activity
4. Access admin sections:
   - Users management
   - Universities database
   - Blog management
   - Circulars posting
   - Analytics
   - Security settings

---

## Test Data

### Saved Universities (for student accounts)
- University of Dhaka
- BUET
- NSU (North South University)
- AIUB (American International University-Bangladesh)
- DIU (Daffodil International University)

### Chat Conversations
- 5 sample conversations per student
- Message history stored in Supabase

### Blog Posts
- 6 articles published
- Categories: Guide, Rankings, Scholarships, Preparation

### Circulars
- 20+ admission circulars
- Updated deadlines
- Program information

---

## Creating More Test Users

### Via Supabase UI
1. Go to Supabase Dashboard → Authentication
2. Click "Add user"
3. Enter email and password
4. Create corresponding profile in `profiles` table:
   ```sql
   INSERT INTO profiles (id, full_name, role, created_at)
   VALUES (user_id, 'Full Name', 'student', now());
   ```

### Via Script
```bash
# Run the test user seeding script
npx ts-node scripts/seed-test-users.ts
```

---

## Common Test Scenarios

### 1. Email Verification Flow
- Use temporary email: `temp-email+[timestamp]@test.com`
- Check `/verify-email` page
- Click verification link in Resend

### 2. Password Reset
- Click "Forgot Password" on login page
- Enter test email
- Check Resend for reset link
- Create new password

### 3. Profile Updates
- Go to `/settings` (or `/dashboard/settings`)
- Update name, academic level, stream
- Change appearance preferences
- Manage notifications

### 4. Application Tracking
- Save multiple universities
- Add to watchlist
- Track application status
- Set deadline reminders

### 5. Dark/Light Mode
- Toggle theme in settings
- Verify styling consistency
- Test across components

---

## Performance Testing

### Load Testing Endpoints
```
GET /api/universities - Should return < 200ms
GET /api/chat - Should return < 500ms
POST /api/bookmarks - Should return < 300ms
GET /api/admin/analytics - Should return < 1000ms
```

### Browser DevTools
1. Open Network tab
2. Monitor API calls
3. Check for unused JavaScript
4. Verify image optimization
5. Monitor Core Web Vitals

---

## Debugging Tips

### Check Network Calls
```javascript
// In browser console
fetch('/api/universities').then(r => r.json()).then(console.log)
```

### View Auth Status
```javascript
// Check Supabase auth in console
const { data } = await supabase.auth.getUser()
console.log(data)
```

### Monitor Database
- Supabase Dashboard → Logs
- Filter by timestamp
- Check query performance

### TypeScript Issues
```bash
# Run type checking
npm run type-check
```

---

## Test Execution Checklist

- [ ] User registration and email verification works
- [ ] User can login/logout
- [ ] Dashboard displays correctly
- [ ] University search and filtering works
- [ ] AI chatbot responds to prompts
- [ ] Blog posts load and display properly
- [ ] Admin dashboard shows accurate statistics
- [ ] Saved universities persist in database
- [ ] Notifications are sent correctly
- [ ] Dark mode toggle works
- [ ] Mobile responsiveness verified
- [ ] Performance metrics acceptable
- [ ] No console errors
- [ ] All API endpoints respond correctly

---

## Notes

⚠️ **Important**: These are test credentials only. Never use them in production.

💾 **Data Persistence**: Test data is stored in your local Supabase instance. You can reset it via the Supabase UI.

🔐 **Security**: Passwords are hashed. Never log plain text passwords in production.

📊 **Analytics**: Test conversions will appear in admin analytics - this is expected.

---

## Support

For issues or questions about testing:
1. Check the `/DEPLOYMENT.md` guide
2. Review Supabase documentation
3. Check Next.js docs for framework-specific issues
4. Create a GitHub issue with test scenario details
