# Features to Build - Based on Old Site Screenshots

## ✅ What's Already Built
- Home page with professional design
- Contact form
- Basic admin dashboard
- Customer list/add/delete
- Basic estimates
- Basic invoices
- Authentication system

## 🔨 What Needs to Be Built (From Screenshots)

### 1. **Admin Navigation** (High Priority)
Current nav is inconsistent. Need unified nav with:
- Dashboard
- Estimates
- Invoices
- Customers
- Services
- Calculator
- Portfolio (maybe?)
- Logout

### 2. **Services Management Page** ✨ (Seen in screenshots)
Card-based layout showing:
- Service name
- Category badge (SEALING, STRIPING, REPAIR, MAINTENANCE)
- Price (e.g., $0.25 per sq ft)
- Description
- Active/Inactive status
- Edit/Disable buttons

**Services from screenshots:**
- Sealcoating, Crack Sealing, Joint Sealing
- Parking Lot Striping, Fire Lane Striping, Handicap Symbols, Stop Bars, Arrow Markings
- Asphalt Patching, Concrete Repair, Pothole Repair, Surface Preparation
- Power Washing, Site Inspection, Snow Removal, Weed Control

### 3. **Customer Detail View** 🎯 (Critical!)
When clicking "View" on a customer, show:
- Customer info (name, email, phone, company, address)
- **Jobs tab** - List of jobs for this customer
  - Add new job button
  - Job name, status, created date
- **Photos/Videos tab** - Media gallery
  - Upload photos/videos
  - View/delete media
  - Associate with job/estimate/invoice
- Related estimates count
- Related invoices count
- Quick actions: Create Estimate, Create Invoice

### 4. **Enhanced Estimate Form** 📋
From "New Estimate" screenshot:
- Customer dropdown
- **Job dropdown** (optional) - Select existing job
- Primary Service Type dropdown
- Lot Size (sq ft) input
- Surface Condition dropdown (Good/Fair/Poor)
- **Estimate Items** table:
  - Service dropdown
  - Quantity input
  - Unit Price input (auto-filled from service)
  - Total (calculated)
  - Add/Remove item buttons
  - Horizontal scrolling if needed
- **Total Estimate** (calculated sum)
- Description/Notes textarea

### 5. **Calculator/Quick Estimator** 🧮
Dedicated page for quick cost calculations:
- Add services with quantity and unit price
- See running total
- Area calculator:
  - Length × Width = Area (sq ft)
  - Common parking space sizes (Compact 9×18, Standard 9×20, Large 10×20, Handicap 8×18)
- Quick actions:
  - Create Estimate (saves to database)
  - Create Invoice
  - Save Template

### 6. **Estimates Management Page**
Table showing:
- ID #
- Customer name + email
- Service Type
- Amount
- Status (PENDING, CONVERTED, etc. with color badges)
- Created date
- Valid Until date
- Actions: View, Edit, Email, Invoice button

### 7. **Photo/Video Upload System** 📸
For customers, jobs, estimates, invoices:
- Upload multiple files (photos/videos)
- Preview thumbnails
- Delete media
- Associate with records
- Store in Supabase Storage
- Track in `customer_photos` table

### 8. **Jobs Management**
Add job to customer:
- Job name
- Description
- Status (active/completed/cancelled)
- Created date
- Completed date
- Link estimates to job
- Link invoices to job
- Attach photos/videos to job

---

## 📊 Priority Order

### **Phase 1: Core Admin Improvements** (Do Now)
1. ✅ Fix admin navigation (consistent across all pages)
2. ✅ Services management page (CRUD operations)
3. ✅ Calculator page
4. ✅ Enhanced estimate form with line items

### **Phase 2: Customer Enhancement** (Next)
5. Customer detail view
6. Jobs management
7. Photo/video upload (Supabase Storage)

### **Phase 3: Polish** (Later)
8. Email functionality
9. PDF generation
10. Advanced reporting

---

## 🎨 Design Notes from Screenshots

**Color Scheme:**
- Gold/Yellow: `#fbbf24` (buttons, highlights)
- Blue: Actions, links
- Green: Success, "Active" status, "Create" buttons
- Red: Delete, "Pending" status, "REPAIR" category
- Orange: "STRIPING" category
- Gray: "MAINTENANCE" category
- Dark: Navigation bar background

**Layout:**
- Cards for services (3-column grid)
- Tables for lists (customers, estimates, invoices)
- White background for content areas
- Dark nav bar at top

---

## 📝 Next Immediate Steps

Since you said customers need jobs and photo/video upload, let me start with:

1. **Create Customer Detail Page** with tabs:
   - Info tab (existing data)
   - Jobs tab (add/view jobs)
   - Media tab (upload/view photos/videos)

2. **Update Customer Table** to have "View" button that goes to detail page

Would you like me to start building the customer detail page with jobs and media upload?
