import { CreateJobPosting } from "./create-job-posting";
import { ModWarning } from "./mod-warning";
import { RepostMessage } from "./repost-message";

import type { Command } from "../command";

export const Commands: Command[] = [
  CreateJobPosting,
  ModWarning,
  RepostMessage,
];
