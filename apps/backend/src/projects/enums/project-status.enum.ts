/**
 * Defines the possible statuses of a project.
 */
export enum projectStatus {
  /** The project is planned but not yet started. */
  PLANNED = 'PLANNED',

  /** The project is currently active and ongoing. */
  ACTIVE = 'ACTIVE',

  /** The project has been successfully completed. */
  COMPLETED = 'COMPLETED',

  /** The project was cancelled before completion. */
  CANCELLED = 'CANCELLED',
}
