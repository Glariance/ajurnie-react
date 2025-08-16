# Ajurnie Admin Panel

This folder contains all the admin panel files for the Ajurnie fitness platform.

## 📁 File Structure

```
admin-panel/
├── components/
│   ├── AdminHeader.tsx          # Admin navigation header
│   └── ProtectedRoute.tsx       # Route protection component
├── pages/
│   ├── AdminDashboard.tsx       # Main admin dashboard
│   ├── ExerciseManagement.tsx   # Exercise CRUD operations
│   ├── UserManagement.tsx       # User account management
│   ├── GoalManagement.tsx       # User goals tracking
│   ├── Analytics.tsx            # Platform analytics
│   ├── ExerciseForm.tsx         # Exercise creation/editing form
│   └── Settings.tsx             # Platform settings
└── README.md                    # This file
```

## 🚀 Installation Instructions

1. **Copy Components:**
   - Copy `components/AdminHeader.tsx` to `src/components/`
   - Copy `components/ProtectedRoute.tsx` to `src/components/`

2. **Copy Admin Pages:**
   - Copy all files from `pages/` to `src/pages/admin/`

3. **Update App.tsx:**
   Add the admin routes to your main App.tsx file:

```tsx
import AdminHeader from './components/AdminHeader'
import ProtectedRoute from './components/ProtectedRoute'
import AdminDashboard from './pages/admin/AdminDashboard'
import ExerciseManagement from './pages/admin/ExerciseManagement'
import UserManagement from './pages/admin/UserManagement'
import GoalManagement from './pages/admin/GoalManagement'
import Analytics from './pages/admin/Analytics'
import ExerciseForm from './pages/admin/ExerciseForm'
import Settings from './pages/admin/Settings'

// Add admin routes in your Routes component:
<Route path="/admin/*" element={
  <ProtectedRoute requireAdmin>
    <AdminHeader />
    <main className="flex-grow">
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/exercises" element={<ExerciseManagement />} />
        <Route path="/exercises/new" element={<ExerciseForm />} />
        <Route path="/exercises/:id/edit" element={<ExerciseForm />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/goals" element={<GoalManagement />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </main>
  </ProtectedRoute>
} />
```

## 🔐 Admin Access Setup

1. **Connect to Supabase** (if not already done)
2. **Register/Login** with your account
3. **Add yourself as admin** in the `admin_users` table:

```sql
INSERT INTO admin_users (id, email, role)
VALUES ('your-user-id-here', 'your-email@example.com', 'admin');
```

4. **Navigate to `/admin`** to access the admin panel

## ✨ Features

### Dashboard (`/admin`)
- Real-time platform statistics
- Recent user goals overview
- Quick action buttons
- System health indicators

### Exercise Management (`/admin/exercises`)
- Full CRUD operations for exercises
- Search and filtering capabilities
- Bulk operations support
- Media management (images/videos)

### User Management (`/admin/users`)
- View all registered users
- Edit user roles and subscriptions
- Manage founding member status
- User activity tracking

### Goal Management (`/admin/goals`)
- View submitted user goals
- Track plan generation status
- Detailed goal information
- Filter by goal types

### Analytics (`/admin/analytics`)
- User growth metrics
- Platform usage statistics
- Revenue tracking
- Subscription analytics

### Settings (`/admin/settings`)
- Platform configuration
- Pricing management
- System settings
- Maintenance mode

## 🎨 Design Features

- **Dark theme** with red accent colors
- **Responsive design** for all screen sizes
- **Loading states** and error handling
- **Confirmation dialogs** for destructive actions
- **Search and filtering** across all management pages
- **Modal dialogs** for detailed views

## 🔧 Technical Features

- **TypeScript** for type safety
- **Supabase integration** for real-time data
- **Row-level security** maintained
- **Proper error handling** throughout
- **Optimistic updates** for better UX
- **Responsive tables** with mobile support

## 📱 Mobile Support

All admin pages are fully responsive and work on:
- Desktop computers
- Tablets
- Mobile phones

## 🛡️ Security

- **Admin-only access** with proper authentication
- **Role-based permissions** throughout
- **Input validation** and sanitization
- **Confirmation dialogs** for destructive actions
- **Audit trails** for important actions

## 🚀 Getting Started

1. Copy all files to your project
2. Update your routing configuration
3. Set up admin access in Supabase
4. Navigate to `/admin` to start managing your platform!

For support or questions, please refer to the main project documentation.