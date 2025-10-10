# SprayFoam TV AI Video Generation - Implementation Notes

## 🎯 **Current Status**
- **Goal**: ChatGPT-style AI video interface using Ovi model via HuggingFace
- **Status**: Still debugging - no successful video generation yet
- **Main Issues**: API format, timeouts, database connections

## 🏗️ **Architecture Implemented**

### **Frontend (ChatGPT-style Interface)**
- **File**: `/app/ai-video/page.tsx`
- **Features**:
  - Collapsible sidebar with 3 tabs (History/Images/Videos icons)
  - Orange chevron toggle, auto-closed on mobile
  - Chat-style message containers
  - Real-time progress polling
  - Session history with localStorage

### **Backend (Async Video Generation)**
- **Primary**: `/app/api/generate-video/route.ts`
- **Status Check**: `/app/api/video-jobs/route.ts`
- **Database**: PostgreSQL with `video_jobs` table
- **Fallback**: In-memory temp storage (due to DB issues)

## 🔧 **Technical Implementation Attempts**

### **1. HuggingFace API Format Evolution**
```typescript
// ❌ Failed Attempts:
new HfInference() + Blob input
new HfInference() + Uint8Array input

// ✅ Current Format:
new InferenceClient() + Buffer.from(arrayBuffer) input
provider: "fal-ai"
model: "chetwinlow1/Ovi"
```

### **2. Async Pattern (Due to Timeouts)**
- **Issue**: 504 Gateway Timeout (28+ seconds)
- **Solution**: Immediate job ID return + polling
- **Polling**: Every 2 seconds, max 5 minutes
- **Progress**: 0% → 10% → 30% → 80% → 100%

### **3. Database vs In-Memory**
- **Tried**: PostgreSQL persistence for serverless
- **Problem**: 500 errors, connection issues
- **Current**: Temp Map storage as fallback
- **TODO**: Fix database integration

## 🚨 **Critical Issues Still Unresolved**

### **1. API Format Still Wrong**
- **Error**: `"e.inputs.arrayBuffer is not a function"`
- **Tried**: Blob, Uint8Array, Buffer
- **Need**: Exact format matching working examples

### **2. Infrastructure Problems**
- **500 Internal Server Error** on job creation
- **Database connection** failures in serverless
- **Netlify routing** conflicts (fixed netlify.toml)

### **3. Model Configuration**
- **Missing**: Proper Ovi prompt formatting (`<S>speech<E>`, `<AUDCAP>audio<ENDAUDCAP>`)
- **Unknown**: If fal-ai provider accessible via HF Inference
- **Need**: Verify Ovi model availability/access

## 📋 **Rules/Lessons Learned**

### **DO:**
1. **Use InferenceClient** (not HfInference)
2. **Include provider: "fal-ai"** for Ovi
3. **Use Buffer.from()** for image data
4. **Implement async pattern** for long generations
5. **Add detailed logging** for debugging
6. **Test locally first** before deployment

### **DON'T:**
1. **Don't assume database works** in serverless
2. **Don't use sync processing** for video generation
3. **Don't ignore Netlify routing** conflicts
4. **Don't mix client types** (HfInference vs InferenceClient)

## 🔄 **Next Steps to Try**
1. **Test exact API format** from HF docs
2. **Fix database connection** or accept in-memory limitation
3. **Add Ovi prompt formatting** with speech tags
4. **Verify model accessibility** on production
5. **Consider external service** if HF Inference fails

## 💡 **Key Files Modified**
- `app/ai-video/page.tsx` - ChatGPT interface
- `app/api/generate-video/route.ts` - Main API
- `components/header.tsx` - Navigation link
- `lib/db.ts` - Database schema
- `netlify.toml` - Fixed routing conflicts

**Status**: Ready for next debugging cycle with systematic approach rather than random attempts.