// Model for task
export type Task = {
    taskId: string;
    taskTitle: string;
    taskContent: string;
    taskCreatedDate: string;
    taskDueDate: string;
    taskPriority: string;
    hovered?: boolean;
    complete: boolean;
};