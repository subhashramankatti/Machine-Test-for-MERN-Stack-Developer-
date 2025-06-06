import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Admin users table
  adminUsers: defineTable({
    email: v.string(),
    password: v.string(), // In production, this should be hashed
    name: v.string(),
    role: v.literal("admin"),
  }).index("by_email", ["email"]),

  // Agents table
  agents: defineTable({
    name: v.string(),
    email: v.string(),
    mobileNumber: v.string(),
    countryCode: v.string(),
    password: v.string(), // In production, this should be hashed
    createdBy: v.id("adminUsers"),
  }).index("by_email", ["email"]),

  // CSV uploads table
  csvUploads: defineTable({
    fileName: v.string(),
    uploadedBy: v.id("adminUsers"),
    totalRecords: v.number(),
    status: v.union(v.literal("processing"), v.literal("completed"), v.literal("failed")),
  }),

  // Distributed lists table
  distributedLists: defineTable({
    csvUploadId: v.id("csvUploads"),
    agentId: v.id("agents"),
    records: v.array(v.object({
      firstName: v.string(),
      phone: v.string(),
      notes: v.string(),
    })),
    assignedCount: v.number(),
  }).index("by_agent", ["agentId"])
    .index("by_csv_upload", ["csvUploadId"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
