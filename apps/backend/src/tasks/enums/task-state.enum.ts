/**
 * Defines the possible statuses of a task.
 */
export enum TaskState {
    /** The task is pending to do. */
    TODO = 'TODO',
    /** The task is currently going on */
    INPROGRESS = 'INPROGRESS',
    /** The task is completed */
    DONE = 'DONE',
}