import { TestCaseResult } from '../types';

export class ScoringService {
  /**
   * Calculates the weighted score for an assignment submission.
   * Formula: (Passed Weight / Total Weight) * Max Score
   */
  public static calculateSubmissionScore(
    results: TestCaseResult[],
    maxScore = 50.0
  ): {
    score: number;
    passedWeight: number;
    totalWeight: number;
    passedCount: number;
    totalCount: number;
  } {
    let totalWeight = 0;
    let passedWeight = 0;
    let passedCount = 0;

    for (const r of results) {
      totalWeight += r.weight;
      if (r.is_passed) {
        passedWeight += r.weight;
        passedCount++;
      }
    }

    const score = totalWeight > 0 ? (passedWeight / totalWeight) * maxScore : 0.0;

    return {
      score: Number(score.toFixed(2)),
      passedWeight,
      totalWeight,
      passedCount,
      totalCount: results.length,
    };
  }

  /**
   * Evaluates overall pass/fail status against passing grade threshold.
   */
  public static evaluatePassFail(totalScore: number, passingGrade = 65.0): boolean {
    return totalScore >= passingGrade;
  }
}
