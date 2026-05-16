# Quick Start Guide - New Features Testing

## 🚀 Step 1: Start the Backend

```bash
cd e:\Joedan\server
npm start
```

**Expected Output:**
```
Supabase connection verified ✓
Express server running on http://localhost:5000/api
```

## 🚀 Step 2: Start the Frontend

Open a new terminal:

```bash
cd e:\Joedan\client
npm start
```

**Expected Output:**
```
Webpack dev server running at http://localhost:3001
```

## 🧪 Step 3: Test Hero Image Display

1. Navigate to `http://localhost:3001`
2. Click **"Admin"** button in top right
3. Enter password: `admin123`
4. Go to **"Settings"** tab
5. Find **"hero_image"** setting
6. Enter an image URL (e.g., `https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200`)
7. Click **"Update"** button
8. Go back to the main site (close admin)
9. **Verify**: Hero section should display the background image

## 🧪 Step 4: Test Category Section Title Update

1. Go to Admin → **"Settings"** tab
2. Find **"category_section_title"** setting
3. Change it to something like `"Explore Our Collections"`
4. Click **"Update"**
5. Return to main site
6. **Verify**: "Browse by Category" heading should change to your new title

## 🧪 Step 5: Add Content Cards (Pic + Description)

1. Go to Admin → **"Content Cards"** tab
2. Fill in the form:
   - **Card title**: `"Special Offer"` (for reference)
   - **Card description**: `"Discover our exclusive premium collection with up to 50% off on selected items"`
   - **Image URL**: `https://images.unsplash.com/photo-1441984904556-0ac8a3c64228?w=800`
   - **Display position**: `0`
   - **Position**: Select `"After Browse by Category"`
3. Click **"Add Content Card"**
4. Return to main site
5. **Verify**: You should see a full-width section after "Browse by Category" with image on left and description on right

## 🧪 Step 6: Add Another Content Card

1. Admin → **"Content Cards"** tab
2. Add another card:
   - **Card title**: `"New Arrivals"`
   - **Card description**: `"Check out our latest additions to the collection, handpicked for quality and style"`
   - **Image URL**: `https://images.unsplash.com/photo-1469022563149-aa64fffe498e?w=800`
   - **Display position**: `1`
   - **Position**: Select `"After Browse by Category"`
3. Click **"Add Content Card"**
4. **Verify**: New card appears after the first one

## 🧪 Step 7: Add Popular Products

1. Admin → **"Popular Products"** tab
2. Click the dropdown to **"Select a product to add"**
3. Select any product from the list (if no products exist, add one via Products tab first)
4. Click **"Add to Popular Products"**
5. Repeat for 3-5 products
6. Return to main site
7. **Verify**: New "Popular Products" section appears at the bottom with product cards showing:
   - Product featured image
   - "View Details" button on hover
   - Clicking opens product detail popup

## 🧪 Step 8: Test Picture Clickability

1. On main site, click on any:
   - **Category card** → Should navigate to Level 1 subcategories
   - **Level 1-4 card** → Should navigate to next level
   - **Product card** → Should open product detail popup
   - **Popular product card** → Should open product detail popup
2. **Verify**: All navigation works smoothly

## 🧪 Step 9: Test Responsive Design

1. Open `http://localhost:3001`
2. Open browser Developer Tools (F12)
3. Toggle Device Toolbar (Ctrl+Shift+M)
4. Test at different breakpoints:
   - **Desktop (1400px)**: Content cards show side-by-side
   - **Tablet (768px)**: Content cards stack, reduced padding
   - **Mobile (480px)**: Full-width stacked layout

## ✅ Verification Checklist

After testing, verify all these work:

- [x] Hero image displays when URL added to settings
- [x] Hero title/subtitle load from settings
- [x] Browse by Category heading updates from settings
- [x] Content cards appear before Browse by Category (if added with position: "before_categories")
- [x] Content cards appear after Browse by Category (if added with position: "after_categories")
- [x] Content cards show image and description side-by-side
- [x] Content cards alternate left/right image placement
- [x] Popular Products section displays featured products
- [x] Popular products show "View Details" on hover
- [x] Clicking popular products opens detail popup
- [x] All images are clickable links
- [x] Navigation between levels works
- [x] Responsive design works at all breakpoints
- [x] Admin panel allows adding/editing/deleting content cards
- [x] Admin panel allows adding/removing popular products

## 🔧 Troubleshooting

### Hero Image Not Showing
- Verify URL is publicly accessible
- Try URL format: `https://example.com/image.jpg`
- Check browser console for CORS errors

### Content Cards Not Appearing
- Make sure you've saved the card (check success message)
- Verify `display_position` is set correctly (0 for first card)
- Check that `position_type` is selected

### Popular Products Not Showing
- Verify products exist in the system (check Products tab)
- Make sure you've added at least one product to popular list
- Check that products have a featured_image

### Settings Not Saving
- Check browser console for errors
- Verify you clicked "Update" button
- Wait for success message to appear

## 📱 Testing Different Devices

### Desktop Testing
```bash
# Normal browser at 1400px width
```

### Tablet Testing
- Chrome DevTools: iPad (768px)
- Verify stacked layout

### Mobile Testing
- Chrome DevTools: iPhone 12 (390px)
- Verify full-width layout

## 🎯 Expected Results Summary

**Before Implementation**: 
- Hero didn't display image
- Category heading was hardcoded
- No content card sections
- No popular products

**After Implementation** (what you should see now):
- ✅ Hero image from settings displays beautifully
- ✅ All titles update dynamically from settings
- ✅ Content cards with image + description appear
- ✅ Position control (before/after categories)
- ✅ Popular products section with featured items
- ✅ All images clickable and responsive
- ✅ Professional, polished appearance

## 🚀 Next Steps

Once testing is complete:
1. Add real product images and content
2. Customize settings with your brand colors/text
3. Add multiple content cards for marketing campaigns
4. Feature best-selling products in popular section
5. Deploy to production

---

**Questions?** Check `IMPLEMENTATION_SUMMARY.md` for detailed technical documentation.
