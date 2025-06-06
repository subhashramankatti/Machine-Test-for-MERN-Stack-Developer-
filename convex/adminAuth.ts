import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create default admin user
export const createDefaultAdmin = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if admin already exists
    const existingAdmin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", "admin@example.com"))
      .first();

    if (existingAdmin) {
      return existingAdmin._id;
    }

    // Create default admin
    const adminId = await ctx.db.insert("adminUsers", {
      email: "admin@example.com",
      password: "admin123", // In production, hash this
      name: "Admin User",
      role: "admin",
    });

    return adminId;
  },
});

// Admin login
export const adminLogin = mutation({
  args: {
    email: v.string(),
    password: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("adminUsers")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!admin || admin.password !== args.password) {
      throw new Error("Invalid credentials");
    }

    return {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  },
});

// Get current admin
export const getCurrentAdmin = query({
  args: {
    adminId: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db.get(args.adminId);
    if (!admin) {
      return null;
    }

    return {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };
  },
});
