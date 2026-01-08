import { z } from "zod";

export const categorySchema = z
  .object({
    name: z
      .string()
      .min(1, "Category name is required")
      .min(2, "Category name must be at least 2 characters")
      .max(100, "Category name must be less than 100 characters"),

    image: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true; // Optional field
        return (
          val.startsWith("data:image/") ||
          val.startsWith("blob:") || // Allow blob URLs for local file previews
          val.startsWith("http") ||
          val.startsWith("https://res.cloudinary.com") ||
          val.startsWith("/uploads/")
        ); // Allow local upload paths
      }, "Please provide a valid image URL, data URL, Cloudinary URL, or uploaded file path"),

    internalLink: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true; // Optional field
        return (
          val.startsWith("/") ||
          val.startsWith("http") ||
          val.startsWith("https")
        );
      }, "Internal link must start with /, http, or https"),

    status: z.enum(["active", "inactive"], {
      required_error: "Status is required",
    }),

    isSubCategory: z.boolean(),

    parentId: z.string().optional(),
    
    disclaimer: z
      .string()
      .max(2000, "Disclaimer must be less than 2000 characters")
      .optional(),

    additionalDetails: z
      .string()
      .max(5000, "Additional details must be less than 5000 characters")
      .optional(),

    faqs: z
      .array(
        z.object({
          question: z.string().min(1, "Question is required").max(500, "Question must be less than 500 characters"),
          answer: z.string().min(1, "Answer is required").max(2000, "Answer must be less than 2000 characters"),
        })
      )
      .optional(),
  })
  .superRefine((data, ctx) => {
    // If isSubCategory is true, parentId is required
    if (data.isSubCategory && !data.parentId) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Parent category is required for subcategories",
        path: ["parentId"],
      });
    }

    // Internal link is required only for main categories (not subcategories)
    if (
      !data.isSubCategory &&
      (!data.internalLink || data.internalLink.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Internal link is required for main categories",
        path: ["internalLink"],
      });
    }
  });

export type CategoryFormData = z.infer<typeof categorySchema>;