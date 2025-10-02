/**
 * Represents a step in a sequence of steps.
 *
 * @interface Step
 */
export interface Step {
  /**
   * Additional information or a tip related to the step.
   */
  tip?: string;

  /**
   * The status of the step (e.g., "completed", "active", "disabled").
   */
  status: string;
}
