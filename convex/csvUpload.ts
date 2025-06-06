import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Process CSV data and distribute among agents
export const processCsvData = mutation({
  args: {
    fileName: v.string(),
    csvData: v.array(v.object({
      firstName: v.string(),
      phone: v.string(),
      notes: v.string(),
    })),
    uploadedBy: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    // Create CSV upload record
    const csvUploadId = await ctx.db.insert("csvUploads", {
      fileName: args.fileName,
      uploadedBy: args.uploadedBy,
      totalRecords: args.csvData.length,
      status: "processing",
    });

    // Get all agents
    const agents = await ctx.db.query("agents").collect();
    
    if (agents.length === 0) {
      throw new Error("No agents available for distribution");
    }

    // Distribute data among agents
    const recordsPerAgent = Math.floor(args.csvData.length / agents.length);
    const remainingRecords = args.csvData.length % agents.length;

    let currentIndex = 0;

    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      let recordsForThisAgent = recordsPerAgent;
      
      // Distribute remaining records to first few agents
      if (i < remainingRecords) {
        recordsForThisAgent += 1;
      }

      const agentRecords = args.csvData.slice(currentIndex, currentIndex + recordsForThisAgent);
      currentIndex += recordsForThisAgent;

      // Create distributed list for this agent
      await ctx.db.insert("distributedLists", {
        csvUploadId,
        agentId: agent._id,
        records: agentRecords,
        assignedCount: agentRecords.length,
      });
    }

    // Update CSV upload status
    await ctx.db.patch(csvUploadId, {
      status: "completed",
    });

    return csvUploadId;
  },
});

// Get all CSV uploads
export const getAllCsvUploads = query({
  args: {},
  handler: async (ctx) => {
    const uploads = await ctx.db.query("csvUploads").order("desc").collect();
    return uploads;
  },
});

// Get distributed lists for a CSV upload
export const getDistributedLists = query({
  args: {
    csvUploadId: v.id("csvUploads"),
  },
  handler: async (ctx, args) => {
    const distributedLists = await ctx.db
      .query("distributedLists")
      .withIndex("by_csv_upload", (q) => q.eq("csvUploadId", args.csvUploadId))
      .collect();

    const result = [];
    for (const list of distributedLists) {
      const agent = await ctx.db.get(list.agentId);
      result.push({
        id: list._id,
        agent: agent ? {
          id: agent._id,
          name: agent.name,
          email: agent.email,
        } : null,
        records: list.records,
        assignedCount: list.assignedCount,
      });
    }

    return result;
  },
});

// Get agent's assigned records
export const getAgentRecords = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const distributedLists = await ctx.db
      .query("distributedLists")
      .withIndex("by_agent", (q) => q.eq("agentId", args.agentId))
      .collect();

    const result = [];
    for (const list of distributedLists) {
      const csvUpload = await ctx.db.get(list.csvUploadId);
      result.push({
        id: list._id,
        csvUpload: csvUpload ? {
          id: csvUpload._id,
          fileName: csvUpload.fileName,
          uploadedAt: csvUpload._creationTime,
        } : null,
        records: list.records,
        assignedCount: list.assignedCount,
      });
    }

    return result;
  },
});
