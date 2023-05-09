type Task<T> = () => Promise<T>;

class ProcessingQueue<T> {
	private taskQueue: Task<T>[];
	private processing: boolean;

	constructor() {
		this.taskQueue = [];
		this.processing = false;
	}

	enqueue(task: Task<T>): Promise<void> {
		this.taskQueue.push(task);
		return this.processTasks();
	}

	private async processTasks(): Promise<void> {
		if (this.processing) {
			return;
		}

		this.processing = true;

		while (this.taskQueue.length > 0) {
			const task = this.taskQueue.shift();
			if (task) {
				try {
					await task();
				} catch (error) {
					console.error('Error processing task:', error);
				}
			}
		}

		this.processing = false;
	}
}

export default ProcessingQueue;
