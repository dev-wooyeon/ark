import type { ExperienceStage } from '@/data/resume';

const STAGE_PRIORITY: Record<ExperienceStage['key'], number> = {
  problem: 0,
  decision: 1,
  implementation: 2,
  verification: 3,
  result: 4,
  extension: 5,
};

export function orderExperienceStages(
  stages: ExperienceStage[]
): ExperienceStage[] {
  return stages
    .map((stage, index) => ({ stage, index }))
    .sort((a, b) => {
      const priorityDiff =
        STAGE_PRIORITY[a.stage.key] - STAGE_PRIORITY[b.stage.key];

      if (priorityDiff !== 0) {
        return priorityDiff;
      }

      return a.index - b.index;
    })
    .map(({ stage }) => stage);
}
