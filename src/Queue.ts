import ITask from './Task';

export interface IPriorityTask {
  task: ITask;
  priority: number;
}

// export interface IQueue {
//   enqueue: (value: unknown) => void;
//   dequeue: () => void;
//   isEmpty: () => void;
//   size: () => void;
//   clear: () => void;
// }

export interface IPriorityQueue {
  enqueue: (task: ITask, priority?: number) => void;
  dequeue: () => void;
  isEmpty: () => void;
  addExecuted: (targetId: number) => void;
  delExecuted: (targetId: number) => void;
}

// class Queue implements IQueue {
//   protected _data: unknown[];

//   constructor() {
//     this._data = [];
//   }
//   enqueue(v: unknown) {
//     this._data.push(v);
//   }
//   dequeue() {
//     return this._data.shift();
//   }
//   isEmpty() {
//     return this._data.length === 0;
//   }
//   // size() {
//   //   return this._data.length;
//   // }
//   // clear() {
//   //   this._data.length = 0;
//   // }
// }

export class PriorityQueue implements IPriorityQueue {
  protected _data: IPriorityTask[];
  protected _executed: number[];

  constructor() {
    // super();
    this._data = [];
    this._executed = [];
  }

  enqueue(task: ITask, priority = 0) {
    const priorityTask: IPriorityTask = { task, priority };
    this._data.push(priorityTask);
  }

  dequeue() {
    // this.print();
    if (this.isEmpty()) {
      return false;
    }

    const data = this._data.filter((priorityTask) => !this._executed.includes(priorityTask.task.targetId));
    if (data.length === 0) {
      return false;
    }

    const [firstTask] = data;
    let priority = firstTask.priority;
    let pos = 0;

    data.forEach((o, i) => {
      if (o.priority < priority) {
        priority = o.priority;
        pos = i;
      }
    });

    const [{ task }] = data.splice(pos, 1);
    const index = this._data.findIndex(
      (priorityTask) => priorityTask.task.targetId === task.targetId && priorityTask.task.action === task.action
    );
    this._data.splice(index, 1);
    this.addExecuted(task.targetId);

    return task;
  }

  isEmpty() {
    return this._data.length === 0;
  }

  addExecuted(targetId: number) {
    this._executed.push(targetId);
  }

  delExecuted(targetId: number) {
    const index = this._executed.indexOf(targetId);
    this._executed.splice(index, 1);
  }

  nextPriority(targetId: number) {
    const max = Math.max(
      0,
      ...this._data.filter((priorityTask) => priorityTask.task.targetId === targetId).map((task) => task.priority + 1)
    );
    return max;
  }

  print() {
    console.log('---PRINT---');

    this._data.forEach((priorityTask) =>
      console.log(`${priorityTask.task.targetId}-${priorityTask.task.action}-${priorityTask.priority}`)
    );
  }
}
