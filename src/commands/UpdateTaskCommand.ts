import { AbstractCommand } from './AbstractCommand';
import { TaskList } from '../models/TaskList';
import { Task } from '../models/Task';

export class UpdateTaskCommand extends AbstractCommand {
    private previousTask?: Partial<Task>;

    constructor(
        private taskList: TaskList,
        private taskId: string,
        private updates: Partial<Task>
    ) {
        super();
    }

    execute(): void {
        const task = this.taskList.updateTask(this.taskId, this.updates);
        if (task) {
            this.previousTask = this.invertUpdates(this.updates, task);
        }
    }

    undo(): void {
        if (this.previousTask) {
            this.taskList.updateTask(this.taskId, this.previousTask);
        }
    }

    private invertUpdates(
        updates: Partial<Task>,
        current: Task
    ): Partial<Task> {
        const inverted: Partial<Task> = {};

        for (const key of Object.keys(updates) as (keyof Task)[]) {
            switch (key) {
                case 'id':
                case 'title':
                case 'description':
                case 'priority':
                    inverted[key] = current[key] as 'low' | 'medium' | 'high';
                    break;
                case 'completed':
                    inverted[key] = current[key] as boolean;
                    break;
                case 'createdAt':
                case 'dueDate':
                    inverted[key] = current[key] as Date;
                    break;
                case 'tags':
                    inverted[key] = current[key] as string[];
                    break;
            }
        }

        return inverted;
    }


}
