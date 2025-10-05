# How to Add Images to Front Page (Next.js Guide for Flask Developers)

## 🎯 Quick Answer

**Put images in:** `/home/mcsmart/project/sealn-super-site/public/images/`

**Reference them as:** `/images/your-image.jpg`

That's it! No `url_for()` or `static` folder needed in Next.js.

---

## 📁 Directory Structure

```
sealn-super-site/
├── public/                    ← Like Flask's "static" folder
│   └── images/                ← Put your images here
│       ├── hero-parking-lot.jpg
│       ├── project1.jpg
│       ├── project2.jpg
│       ├── logo.png
│       └── ...
├── src/
│   ├── components/
│   │   ├── Hero.tsx           ← Hero section (top of page)
│   │   ├── Portfolio.tsx      ← Portfolio gallery
│   │   └── Services.tsx       ← Services section
│   └── app/
│       └── page.tsx           ← Main home page
```

---

## 🖼️ How to Add Hero Background Image

### Flask Way (What You Know):
```html
<!-- In templates/index.html -->
<div style="background-image: url('{{ url_for('static', filename='images/hero.jpg') }}')">
```

### Next.js Way (New):
```tsx
// In src/components/Hero.tsx
<div className="bg-[url('/images/hero-parking-lot.jpg')]">
```

**Steps:**
1. Place your parking lot image at: `/public/images/hero-parking-lot.jpg`
2. The Hero component already references it!
3. Refresh page - done!

---

## 📸 How to Add Portfolio Images

### Current Code (src/components/Portfolio.tsx):
```tsx
const projects = [
  { id: 1, title: 'Commercial Plaza', image: '/images/project1.jpg' },
  { id: 2, title: 'Shopping Center', image: '/images/project2.jpg' },
  { id: 3, title: 'Office Complex', image: '/images/project3.jpg' },
];
```

**Steps:**
1. Copy your project photos to `/public/images/`
2. Name them: `project1.jpg`, `project2.jpg`, etc.
3. Edit titles in the array above
4. Refresh page!

---

## 🎨 How to Add Logo

### In Header (src/components/Header.tsx):
```tsx
<Link href="/">
  <img src="/images/logo.png" alt="Logo" className="h-12" />
</Link>
```

**Steps:**
1. Place logo at: `/public/images/logo.png`
2. Update Header.tsx with the code above
3. Done!

---

## 🆚 Flask vs Next.js Quick Reference

| Task | Flask | Next.js |
|------|-------|---------|
| Put images | `static/images/` | `public/images/` |
| Reference | `{{ url_for('static', filename='images/foo.jpg') }}` | `/images/foo.jpg` |
| In CSS | `background-image: url('/static/images/bg.jpg')` | `background-image: url('/images/bg.jpg')` |
| In HTML | `<img src="{{ url_for('static', filename='images/logo.png') }}" />` | `<img src="/images/logo.png" />` |

---

## ✅ Files You Can Edit

### 1. Hero Section
**File:** `src/components/Hero.tsx`
**Line 5:** Change background image path
**Lines 11-16:** Change text content

### 2. Portfolio Section
**File:** `src/components/Portfolio.tsx`
**Lines 6-12:** Update project array with your images

### 3. Services Section
**File:** `src/components/Services.tsx`
**Lines 5-24:** Update services data

---

## 🚀 Pro Tips

1. **Optimize images first:**
   - Compress photos before uploading
   - Use JPG for photos
   - Use PNG for logos/graphics
   - Keep under 500KB each

2. **Naming convention:**
   - Use lowercase
   - Use hyphens, not spaces
   - Be descriptive: `parking-lot-before.jpg` not `IMG_1234.jpg`

3. **Responsive images:**
   ```tsx
   <img
     src="/images/logo.png"
     alt="Logo"
     className="w-full h-auto"  // Makes it responsive
   />
   ```

---

## 🎬 Video Example

### Adding a Hero Background:

1. Open file manager: `/home/mcsmart/project/sealn-super-site/public/images/`
2. Copy your parking lot photo there as: `hero-parking-lot.jpg`
3. Open browser: `http://localhost:3000`
4. Refresh - see your image!

**If image doesn't show:**
- Check file name matches exactly (case-sensitive!)
- Check file is actually in `/public/images/`
- Check browser console for errors (F12)
- Try hard refresh: Ctrl+Shift+R

---

## 📝 Example: Replace All Homepage Images

```bash
# 1. Navigate to images folder
cd /home/mcsmart/project/sealn-super-site/public/images/

# 2. Copy your images
cp /path/to/your/images/*.jpg .

# 3. Rename to match code
mv your-hero-image.jpg hero-parking-lot.jpg
mv project-photo-1.jpg project1.jpg
mv project-photo-2.jpg project2.jpg
# ... etc
```

That's it! Images will appear automatically.
