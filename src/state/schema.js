import { z } from 'zod';

/**
 * Zod schemas for runtime validation of domain models
 */

export const InboxItemSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  createdAt: z.number().int().positive(),
});

export const ActionSchema = z.object({
  id: z.string(),
  text: z.string().min(1),
  done: z.boolean(),
  createdAt: z.number().int().positive(),
  dueDate: z.number().int().positive().optional(),
  context: z.string().optional(),
  energy: z.string().optional(),
  notes: z.string().optional(),
});

export const StateSchema = z.object({
  ui: z.object({
    theme: z.enum(['light', 'dark']),
    route: z.string(),
    query: z.string(),
    showDone: z.boolean(),
    contextFilter: z.string(),
    energyFilter: z.string(),
    captureOpen: z.boolean(),
    captureText: z.string(),
    drawerOpen: z.boolean(),
    drawerKind: z.enum(['action']),
    drawerSelectedId: z.string(),
    drawerDraft: z.record(z.any()),
  }),
  data: z.object({
    inbox: z.array(InboxItemSchema),
    actions: z.array(ActionSchema),
  }),
});
