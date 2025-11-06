# Cloudinary Integration Setup

This document explains how to set up Cloudinary for category image uploads in the Gharsamma E-commerce application.

## Prerequisites

1. A Cloudinary account (sign up at https://cloudinary.com)
2. Access to your Cloudinary dashboard

## Setup Steps

### 1. Get Cloudinary Credentials

1. Log in to your Cloudinary dashboard
2. Go to the Dashboard section
3. Copy the following values:
   - Cloud Name
   - API Key
   - API Secret

### 2. Configure Envirocnment Variables

Add the following environment variables to your `.env` file in the `apps/api` directory:

```env
# Cloudinary Configuration (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

**Note**: Cloudinary credentials are optional. The application will start without them, but image upload functionality will be disabled. You'll see a warning in the logs: "Cloudinary credentials not found. Image upload functionality will be disabled."

### 3. Install Dependencies

The Cloudinary package has already been added to the API package. If you need to reinstall:

```bash
cd apps/api
pnpm install cloudinary
```

### 4. Features Implemented

#### Backend (API)
- **Cloudinary Configuration**: `/apps/api/src/config/cloudinary.ts`
  - Image upload with automatic optimization
  - Image deletion functionality
  - Error handling and logging

- **Upload Route**: `/apps/api/src/routes/upload.ts`
  - POST `/api/v1/upload/category` - Upload category images
  - File validation (image type, size limit)
  - Multer configuration for memory storage

- **Environment Configuration**: Updated to include Cloudinary variables

#### Frontend (Admin)
- **Enhanced Image Upload**: Updated category form with Cloudinary integration
- **Real-time Upload**: Images are uploaded to Cloudinary immediately when selected
- **Loading States**: Visual feedback during upload process
- **Image Preview**: Support for both local and Cloudinary images
- **Error Handling**: User-friendly error messages

### 5. How It Works

1. **Image Selection**: User selects an image file in the admin interface
2. **Validation**: Client-side validation for file type and size
3. **Upload**: Image is sent to `/api/v1/upload/category` endpoint
4. **Cloudinary Processing**: Image is uploaded to Cloudinary with optimizations:
   - Automatic format conversion to WebP
   - Resizing to 800x600 with fill crop
   - Quality optimization
5. **URL Return**: Cloudinary returns the optimized image URL
6. **Form Update**: The form is updated with the Cloudinary URL
7. **Category Creation**: When the form is submitted, the Cloudinary URL is saved to the database

### 6. Image Optimization

Images uploaded to Cloudinary are automatically optimized:
- **Format**: Converted to WebP for better compression
- **Size**: Resized to 800x600 pixels with fill crop
- **Quality**: Auto-optimized for web delivery
- **Folder**: Organized in the "categories" folder

### 7. Error Handling

The system handles various error scenarios:
- Invalid file types
- File size exceeding 5MB limit
- Network errors during upload
- Cloudinary service errors
- Database save errors

### 8. Testing

To test the integration:

1. Start the API server:
   ```bash
   cd apps/api
   pnpm dev
   ```

2. Start the admin application:
   ```bash
   cd apps/admin
   pnpm dev
   ```

3. Navigate to the Categories page in the admin interface
4. Try creating a new category with an image
5. Verify the image appears correctly and the URL is a Cloudinary URL

### 9. Troubleshooting

**Common Issues:**

1. **"Cloudinary cloud name is required" error**
   - Ensure CLOUDINARY_CLOUD_NAME is set in your .env file

2. **Upload fails with 401 error**
   - Check that CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET are correct

3. **Images not displaying**
   - Verify the Cloudinary URL is being returned correctly
   - Check browser console for any CORS issues

4. **File upload fails**
   - Ensure file is under 5MB
   - Check that file is a valid image format

### 10. Security Considerations

- API keys are stored in environment variables
- File uploads are validated for type and size
- Images are stored in a dedicated Cloudinary folder
- No sensitive data is exposed in image URLs

### 11. Future Enhancements

Potential improvements that could be added:
- Image cropping/editing before upload
- Multiple image uploads for categories
- Image compression settings
- CDN integration for faster delivery
- Image transformation presets
- Automatic backup of images
