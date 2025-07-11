# St. Gabriel Chaplaincy - Professional Member Registration System

A complete, professional HTML-based member registration system designed specifically for Catholic Church communities.

## 🌟 Features

### **Complete Registration System**
- ✅ Comprehensive member registration form
- 🆔 Automatic ID card generation with photos
- 📊 Real-time statistics and analytics
- 👨‍💼 Admin panel for member management
- 📱 Fully responsive design for all devices
- 🎨 Professional church-appropriate styling

### **Registration Process**
1. **Personal Information** - Name, DOB, gender, marital status
2. **Contact Details** - Phone, email, address
3. **Photo Upload** - Passport photo with preview
4. **Ministry Selection** - Choose from 14+ ministries or specify custom
5. **Spiritual Information** - Years in faith, sacramental status
6. **Payment Information** - Bank transfer details
7. **ID Card Generation** - Professional membership card

### **Professional Design Elements**
- 🎨 Church-appropriate color scheme (Gold, Blue, Burgundy)
- ✨ Gradient backgrounds and animations
- 🏛️ Professional typography (Playfair Display + Inter)
- 💫 Smooth transitions and hover effects
- 📱 Mobile-first responsive design
- 🖼️ Beautiful card layouts and shadows

## 🚀 Quick Start

### **For GitHub Pages Deployment:**

1. **Create Repository**
   \`\`\`bash
   git clone https://github.com/yourusername/st-gabriel-registration.git
   cd st-gabriel-registration
   \`\`\`

2. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Save and wait for deployment

3. **Access Your Site**
   - Your site will be available at: `https://yourusername.github.io/st-gabriel-registration`

### **For Local Development:**

1. **Download Files**
   - Download `index.html` to your computer
   - Open directly in any modern web browser
   - No server setup required!

## 📋 System Requirements

### **Browser Compatibility**
- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### **Features Supported**
- Local Storage for data persistence
- File upload for photos
- Print functionality for ID cards
- Responsive design for all screen sizes

## 🎛️ Admin Features

### **Statistics Dashboard**
- Total member count
- Daily registration tracking
- Monthly registration analytics
- Recent registrations list

### **Member Management**
- View all registered members
- Member details and contact information
- Registration date tracking
- Ministry assignments

### **Data Export**
- All data stored in browser localStorage
- Easy export functionality (can be added)
- No external database required

## 🎨 Customization Guide

### **Church Information**
Edit these sections in `index.html`:

\`\`\`html
<!-- Church Name -->
<h1>St. Gabriel Chaplaincy</h1>

<!-- Bank Details -->
<div><strong>Bank Name:</strong> Fidelity Bank Nigeria</div>
<div><strong>Account Number:</strong> 5070123456</div>
<div><strong>Account Name:</strong> St. Gabriel Chaplaincy</div>

<!-- Registration Fee -->
<div class="payment-amount">₦2,000</div>
\`\`\`

### **Ministry Options**
Add or modify ministries in the select dropdown:

\`\`\`html
<option value="Your Ministry">🎵 Your Ministry Name</option>
\`\`\`

### **Color Scheme**
Modify CSS variables at the top of the style section:

\`\`\`css
:root {
    --church-gold: #D4AF37;
    --church-blue: #1e3a8a;
    --church-burgundy: #800020;
    --church-cream: #F5F5DC;
}
\`\`\`

### **Styling Customization**
- **Fonts**: Change Google Fonts imports
- **Colors**: Modify CSS custom properties
- **Layout**: Adjust grid and flexbox properties
- **Animations**: Customize keyframe animations

## 💾 Data Management

### **Local Storage Structure**
\`\`\`javascript
// Member counter
localStorage.setItem('memberCounter', '1');

// Registration data
localStorage.setItem('registrations', JSON.stringify([...]));

// Statistics
localStorage.setItem('registrationStats', JSON.stringify({
    daily: { '2024-01-01': 5 },
    monthly: { '2024-01': 25 }
}));
\`\`\`

### **Data Persistence**
- All data stored locally in browser
- No external database required
- Data persists between sessions
- Easy backup via localStorage export

## 🔒 Security & Privacy

### **Data Protection**
- All data stored locally in user's browser
- No data transmitted to external servers
- Payment information is display-only
- Photo files stored as base64 in localStorage

### **Production Considerations**
- Deploy with HTTPS for security
- Consider data backup solutions
- Implement proper form validation
- Add email notification system

## 🛠️ Technical Details

### **Technologies Used**
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with custom properties
- **JavaScript ES6+** - Modern JavaScript features
- **Font Awesome** - Professional icons
- **Google Fonts** - Typography (Playfair Display, Inter)

### **Performance Features**
- Optimized CSS with efficient selectors
- Minimal JavaScript for fast loading
- Compressed images and assets
- Mobile-optimized responsive design

## 📞 Support & Customization

### **Common Customizations**
1. **Add Email Notifications** - Integrate with EmailJS
2. **Database Integration** - Connect to Firebase/Supabase
3. **Payment Gateway** - Add real payment processing
4. **Multi-language Support** - Add translation system
5. **Advanced Analytics** - Add charts and graphs

### **Getting Help**
- Check the code comments for guidance
- Modify CSS variables for quick styling changes
- Use browser developer tools for debugging
- Create GitHub issues for bug reports

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Credits

**Built with ❤️ for Catholic Church Communities**

- Professional design inspired by modern church websites
- Responsive layout for accessibility on all devices
- Secure local storage for data privacy
- Print-friendly ID card generation

---

© 2024 St. Gabriel Chaplaincy. All rights reserved.

*"Under the Protection of Archangel Gabriel"*
\`\`\`

```plaintext file=".gitignore"
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production builds
/dist
/build

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# Temporary folders
tmp/
temp/

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Backup files
*.bak
*.backup
*.old

# Database files (if any)
*.db
*.sqlite
*.sqlite3

# Cache files
.cache/
.parcel-cache/

# Editor directories and files
.vscode/
!.vscode/extensions.json
.idea/
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
