import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create agent
export const createAgent = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    mobileNumber: v.string(),
    countryCode: v.string(),
    password: v.string(),
    createdBy: v.id("adminUsers"),
  },
  handler: async (ctx, args) => {
    // Check if agent with email already exists
    const existingAgent = await ctx.db
      .query("agents")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingAgent) {
      throw new Error("Agent with this email already exists");
    }

    const agentId = await ctx.db.insert("agents", {
      name: args.name,
      email: args.email,
      mobileNumber: args.mobileNumber,
      countryCode: args.countryCode,
      password: args.password, // In production, hash this
      createdBy: args.createdBy,
    });

    return agentId;
  },
});

// Get all agents
export const getAllAgents = query({
  args: {},
  handler: async (ctx) => {
    const agents = await ctx.db.query("agents").collect();
    return agents.map(agent => ({
      id: agent._id,
      name: agent.name,
      email: agent.email,
      mobileNumber: agent.mobileNumber,
      countryCode: agent.countryCode,
      createdAt: agent._creationTime,
    }));
  },
});

// Get agent by ID
export const getAgentById = query({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    if (!agent) {
      return null;
    }

    return {
      id: agent._id,
      name: agent.name,
      email: agent.email,
      mobileNumber: agent.mobileNumber,
      countryCode: agent.countryCode,
    };
  },
});

// Update agent
export const updateAgent = mutation({
  args: {
    agentId: v.id("agents"),
    name: v.string(),
    email: v.string(),
    mobileNumber: v.string(),
    countryCode: v.string(),
  },
  handler: async (ctx, args) => {
    const { agentId, ...updateData } = args;
    
    await ctx.db.patch(agentId, updateData);
    return agentId;
  },
});

// Delete agent
export const deleteAgent = mutation({
  args: {
    agentId: v.id("agents"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.agentId);
    return true;
  },
});
