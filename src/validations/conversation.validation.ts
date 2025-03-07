import { z } from "zod";

export const createConversationSchema = z.object({
  participantIds: z.array(z.string().uuid()).min(1, "At least one participant is required"),
  isGroup: z.boolean(),
  name: z.string().min(3, "Name must be at least 3 characters long").optional(),
}).refine((data) => {
  return !data.isGroup || (data.isGroup && data.name);
}, {
  message: "Group name is required when isGroup is true",
  path: ["name"]
});
