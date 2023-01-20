import { CreateJobPosting } from "./create-job-posting";
import { ModWarning } from "./mod-warning";
import { QuestionPls } from "./question-pls";

import type { Command } from "../command";

export const Commands: Command[] = [CreateJobPosting, ModWarning, QuestionPls];
