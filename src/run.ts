import { getQueue } from '../test/data'; //TODO delete behind commit
import Executor from './Executor'; //TODO delete behind commit

import { IExecutor } from './Executor';
import { PriorityQueue } from './Queue';
import ITask from './Task';

const priorityQueue = new PriorityQueue();

export default async function run(executor: IExecutor, queue: AsyncIterable<ITask>, maxThreads = 0) {
  maxThreads = Math.max(0, maxThreads);
  let threads = maxThreads || Infinity;
  const tasks = [];

  // const priorityQueue = new PriorityQueue();

  const executeTask = async () => {
    const task = priorityQueue.dequeue();

    if (task) {
      // console.log('-task-');

      await executor.executeTask(task);

      priorityQueue.delExecuted(task.targetId);
      // console.log('-next task-');
      await executeTask();
    }
  };

  for await (const task of queue) {
    if (threads > 0) {
      priorityQueue.enqueue(task);
      threads -= 1;
      tasks.push(executeTask());
    } else {
      const priority = priorityQueue.nextPriority(task.targetId);
      // console.log(`--- ${task.targetId} - ${task.action} - ${priority}`);
      priorityQueue.enqueue(task, priority);
    }
  }

  return Promise.all(tasks);
}

//TODO remove before commit
// const queue = getQueue();
// const executor = new Executor();

// const test = async () => {
//   const result = await run(executor, queue, 3);
//   console.log(result);
//   console.log('-END-');
// priorityQueue.print();
// };

// test();
//TODO END
