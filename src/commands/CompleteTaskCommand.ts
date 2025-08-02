import { AbstractCommand } from './AbstractCommand';
import { TaskList } from '../models/TaskList';

export class CompleteTaskCommand extends AbstractCommand {
    private previousStatus: boolean = false;

    constructor(
        private taskList: TaskList,
        private taskId: string,
        private completed: boolean
    ) {
        super();
    }

    execute(): void {
        const task = this.taskList.completeTask(this.taskId, this.completed);
        if (task) {
            this.previousStatus = !this.completed;
        }
    }

    undo(): void {
        this.taskList.completeTask(this.taskId, this.previousStatus);
    }
}
