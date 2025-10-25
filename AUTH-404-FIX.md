# 🔐 AUTHENTICATION 404 ERROR FIX

## ❌ ERRORS:

```
GET /api/notifications/unread/count - 404
POST /api/comments/reactions - 404
```

---

## 🔍 ROOT CAUSE:

### **Routes EXIST but require AUTHENTICATION!**

**notifications.routes.js:**
```javascript
// Line 7: ALL routes require auth!
router.use(authMiddleware);

router.get('/unread/count', notificationController.getUnreadCount);
```

**comments.routes.js:**
```javascript
// Reactions require auth
router.post('/reactions', authMiddleware, commentController.addReaction);
```

### **Problem:**
- ✅ Routes exist
- ✅ Controllers exist
- ❌ **User not authenticated!**
- ❌ **No token or token expired!**

---

## 🎯 SOLUSI:

### **Option 1: Make Routes Public (Not Recommended)**

**Only if you want anonymous reactions:**

```javascript
// comments.routes.js
// Get reactions - PUBLIC
router.get('/reactions/:content_type/:content_id', commentController.getReactionSummary);

// Add reaction - REQUIRE AUTH
router.post('/reactions', authMiddleware, commentController.addReaction);

// Remove reaction - REQUIRE AUTH
router.delete('/reactions/:content_type/:content_id', authMiddleware, commentController.removeReaction);
```

---

### **Option 2: Ensure User is Logged In (Recommended)**

**Frontend must:**
1. ✅ Login user
2. ✅ Store token
3. ✅ Send token with requests

---

## 💻 FRONTEND FIX:

### **Check if User is Logged In:**

**File:** `frontend/src/services/api.js` or similar

```javascript
// Check if token exists
const token = localStorage.getItem('token');

if (!token) {
  console.error('No token found! User must login.');
  // Redirect to login
  window.location.href = '/login';
}

// Add token to requests
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

---

### **API Service Example:**

```javascript
// services/api.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### **Notifications Service:**

```javascript
// services/notificationService.js
import api from './api';

export const getUnreadCount = async () => {
  try {
    const response = await api.get('/api/notifications/unread/count');
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('User not authenticated');
      return { count: 0 }; // Return 0 if not logged in
    }
    throw error;
  }
};
```

---

### **Comments Service:**

```javascript
// services/commentService.js
import api from './api';

export const addReaction = async (contentType, contentId, reactionType) => {
  try {
    const response = await api.post('/api/comments/reactions', {
      content_type: contentType,
      content_id: contentId,
      reaction_type: reactionType
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('Please login to react');
      // Show login modal or redirect
      return null;
    }
    throw error;
  }
};
```

---

## 🔧 COMPONENT FIX:

### **Check Auth Before Calling API:**

```javascript
// components/ReactionBar.jsx
import { useState, useEffect } from 'react';
import { addReaction } from '../services/commentService';

const ReactionBar = ({ contentType, contentId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleReaction = async (reactionType) => {
    // Check if user is logged in
    if (!user) {
      alert('Please login to react!');
      // Or show login modal
      return;
    }

    try {
      await addReaction(contentType, contentId, reactionType);
      // Update UI
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  return (
    <div className="reaction-bar">
      <button onClick={() => handleReaction('like')}>
        👍 Like
      </button>
      <button onClick={() => handleReaction('love')}>
        ❤️ Love
      </button>
    </div>
  );
};
```

---

### **Notifications Component:**

```javascript
// components/NotificationBell.jsx
import { useState, useEffect } from 'react';
import { getUnreadCount } from '../services/notificationService';

const NotificationBell = () => {
  const [count, setCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    if (token) {
      // Fetch unread count
      fetchUnreadCount();
    }
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setCount(data.count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
      setCount(0);
    }
  };

  // Don't show bell if not logged in
  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="notification-bell">
      🔔
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  );
};
```

---

## 🧪 TESTING:

### **Test 1: Check Token**
```javascript
// Console
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));
```

**If null:**
- User not logged in
- Need to login first

---

### **Test 2: Test API with Token**
```bash
# Get token from localStorage
TOKEN="your_token_here"

# Test notifications
curl -H "Authorization: Bearer $TOKEN" \
  https://apiv1.pergimmikan.site/api/notifications/unread/count

# Test reactions
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content_type":"journey","content_id":95,"reaction_type":"like"}' \
  https://apiv1.pergimmikan.site/api/comments/reactions
```

**Expected:**
- ✅ 200 OK (if token valid)
- ❌ 401 Unauthorized (if token invalid/expired)
- ❌ 404 Not Found (if no token sent)

---

## 🔐 AUTH FLOW:

### **1. User Login:**
```javascript
// Login
const response = await api.post('/api/auth/login', {
  username: 'user',
  password: 'pass'
});

// Store token
localStorage.setItem('token', response.data.token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Set default header
axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
```

---

### **2. Check Auth on Page Load:**
```javascript
// App.jsx or main component
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    // Set token in axios
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    // Optionally verify token
    verifyToken(token);
  }
}, []);
```

---

### **3. Handle Token Expiry:**
```javascript
// Interceptor
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

---

## 📊 DEBUGGING:

### **Check Request Headers:**

**Chrome DevTools:**
1. F12 → Network tab
2. Click failed request
3. Check "Request Headers"
4. Look for: `Authorization: Bearer xxx`

**If missing:**
- Token not being sent
- Fix axios interceptor

**If present but 401:**
- Token expired
- Token invalid
- User logged out

---

## ✅ SOLUTION SUMMARY:

### **Why 404?**
Routes exist but return 404 when:
- ❌ No Authorization header
- ❌ Invalid token
- ❌ Token expired

### **Fix:**
1. ✅ **Login user** - Get token
2. ✅ **Store token** - localStorage
3. ✅ **Send token** - Authorization header
4. ✅ **Handle errors** - 401 → redirect to login

---

## 🎯 QUICK FIX:

### **Option A: Login First**
```
1. Go to /login
2. Login with credentials
3. Token stored automatically
4. Try reactions/notifications again
```

### **Option B: Make Routes Public** (Not recommended for reactions)
```javascript
// notifications.routes.js
// Remove global auth middleware
// router.use(authMiddleware); // ❌ Remove this

// Add auth per route
router.get('/', authMiddleware, notificationController.getNotifications);
router.get('/unread/count', authMiddleware, notificationController.getUnreadCount);
```

---

## 🚀 RECOMMENDED APPROACH:

### **1. Check if User Logged In:**
```javascript
const isLoggedIn = !!localStorage.getItem('token');
```

### **2. Show Login Prompt:**
```javascript
if (!isLoggedIn) {
  // Show login modal or redirect
  return <LoginPrompt />;
}
```

### **3. Only Call API if Logged In:**
```javascript
useEffect(() => {
  if (isLoggedIn) {
    fetchNotifications();
  }
}, [isLoggedIn]);
```

---

**🔐 AUTHENTICATION REQUIRED!**

**User must login to:**
- ✅ View notifications
- ✅ Add reactions
- ✅ Post comments
- ✅ Access protected routes

**Fix:** Ensure user is logged in and token is sent with requests!
