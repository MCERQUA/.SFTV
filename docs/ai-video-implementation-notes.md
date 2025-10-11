# SprayFoam TV AI Video Generation - Implementation Guide

## 🎯 **Current Status** ✅ WORKING (Oct 11, 2025)
- **Goal**: ChatGPT-style AI video interface using Ovi model via HuggingFace
- **Status**: ✅ **PRODUCTION READY** - Fully functional with efficient video serving
- **Architecture**: Netlify Blobs storage + dedicated blob serving endpoint
- **URL**: https://sprayfoamtv.com/ai-video

## 🏗️ **Working Architecture**

### **Frontend (ChatGPT-style Interface)**
- **File**: `/app/ai-video/page.tsx`
- **Features**:
  - Collapsible sidebar with 3 tabs (History/Images/Videos icons)
  - Orange chevron toggle, auto-closed on mobile
  - Chat-style message containers
  - Real-time progress polling (every 2 seconds)
  - Session history with localStorage persistence

### **Backend (Async Video Generation)**
- **Primary API**: `/app/api/generate-video/route.ts` - Handles video generation with HuggingFace
- **Status Polling**: `/app/api/video-jobs/route.ts` - Returns job status and progress
- **Video Serving**: `/app/api/video-blob/[jobId]/route.ts` - Streams completed videos
- **Storage**: Netlify Blobs (`ai-videos` store) with in-memory fallback

## 🔧 **Technical Implementation**

### **Video Generation Flow**
1. **User Input**: Upload image + text prompt
2. **Job Creation**: Generate unique jobId, store in tempJobs Map
3. **HuggingFace API**: Call `chetwinlow1/Ovi` model via `@huggingface/inference`
4. **Storage**: Save video to Netlify Blobs (or base64 fallback)
5. **Response**: Return `/api/video-blob/{jobId}` URL to frontend
6. **Streaming**: Browser fetches video via blob endpoint with proper headers

### **HuggingFace Integration**
```typescript
// Working API format
const client = new InferenceClient(apiKey, { provider: 'fal-ai' })
const videoBlob = await client.imageToVideo({
  model: 'chetwinlow1/Ovi',
  provider: 'fal-ai',
  inputs: imageInput, // Blob with correct MIME type
  parameters: { prompt }
})
```

### **Storage Strategy**
- **Production**: Netlify Blobs for persistent, efficient storage
- **Development**: Base64 in-memory fallback
- **Detection**: Uses `process.env.NETLIFY` environment variable
- **Graceful Fallback**: Automatically switches if Netlify Blobs unavailable

### **Video Serving**
- **Endpoint**: `/api/video-blob/[jobId]`
- **Headers**: Proper `Content-Type`, `Content-Length`, `Accept-Ranges`, caching
- **Format**: Binary video streams (WebM/MP4) - no data URL size limits
- **Performance**: 24-hour browser caching, efficient streaming

## 🔑 **Key Configuration**

### **Environment Variables**
- `HF_TOKEN`: HuggingFace API token (set in Netlify dashboard)
- `NETLIFY`: Auto-set by Netlify (used for storage detection)

### **Dependencies**
- `@huggingface/inference`: ^4.11.1
- `@netlify/blobs`: ^7.4.0
- `@netlify/functions`: ^2.0.0

## 📁 **File Structure**
```
app/
├── ai-video/page.tsx              # Main UI interface
├── api/
│   ├── generate-video/route.ts    # Video generation endpoint
│   ├── video-jobs/route.ts        # Status polling endpoint
│   └── video-blob/[jobId]/route.ts # Video streaming endpoint
components/
├── header.tsx                     # Navigation (includes AI Video link)
docs/
└── ai-video-implementation-notes.md # This documentation
```

## 🚀 **Performance Characteristics**
- **Generation Time**: ~40-45 seconds typical
- **Video Size**: ~2MB WebM output
- **Polling Frequency**: Every 2 seconds
- **Timeout**: 5 minutes max
- **Progress Updates**: 0% → 10% → 30% → 80% → 100%

## 🛡️ **Security**
- HuggingFace API token stored as environment variable
- No hardcoded secrets in codebase
- Test directories gitignored
- Proper CORS and content-type headers

## 📋 **Development Guidelines**

### **Working Patterns**
- Use `InferenceClient` with `provider: 'fal-ai'` for Ovi model
- Implement async pattern for long video generations
- Use Netlify Blobs for persistent storage
- Proper binary video streaming with headers
- Environment detection for graceful fallbacks

### **Key Files**
- `app/ai-video/page.tsx` - Main interface
- `app/api/generate-video/route.ts` - Core video generation logic
- `app/api/video-blob/[jobId]/route.ts` - Video streaming endpoint
- `components/header.tsx` - Navigation integration

**Status**: ✅ **FULLY OPERATIONAL** - Production ready AI video generation system