class Task {
  readonly id: number;
  readonly dateCreated: Date;
  public description: string;
  public isCompleted: boolean;

  constructor(description: string) {
    this.id = Date.now();
    this.dateCreated = new Date();
    this.description = description;
    this.isCompleted = false;
  }
}

class TaskManager {
  tasksArray: Task[];
  addTaskInput: HTMLInputElement;
  addTaskButton: HTMLButtonElement;

  constructor() {
    this.tasksArray = [];

    this.addTaskInput = document.querySelector(
      '.input-container__input'
    ) as HTMLInputElement;
    this.addTaskButton = document.querySelector(
      '.input-container__add-button'
    ) as HTMLButtonElement;

    this.addTaskButton.addEventListener('click', () => this.addTask());

    window.addEventListener('keypress', (event) => {
      if (event.code === 'Enter') {
        this.addTask();
      }
    });

    this.getTasks().then((tasks) => {
      this.tasksArray = tasks;
      this.renderTasks();
    });
  }

  async getTasks(): Promise<Task[]> {
    this.tasksArray = await taskService.getTasks();
    return this.tasksArray;
  }

  async addTask(): Promise<void> {
    const description: string = this.addTaskInput.value.trim();

    if (description) {
      const task = new Task(description);
      await taskService.addTask(task);
      await this.getTasks();
      this.renderTasks();
    }

    this.addTaskInput.value = '';
  }

  async deleteTask(id: number): Promise<void> {
    const taskIndex: number = this.tasksArray.findIndex(
      (task: Task) => task.id === id
    );

    if (taskIndex !== -1) {
      const task = this.tasksArray[taskIndex];
      await taskService.deleteTask(task);
      this.tasksArray.splice(taskIndex, 1);
      this.renderTasks();
    }
  }

  async editDescription(id: number, editedDescription: string): Promise<void> {
    const taskIndex: number = this.tasksArray.findIndex(
      (task: Task) => task.id === id
    );

    if (taskIndex !== -1) {
      const task = this.tasksArray[taskIndex];
      await taskService.editDescription(task);
      task.description = editedDescription;
      this.renderTasks();
    }
  }

  async editStatus(id: number): Promise<void> {
    const taskIndex: number = this.tasksArray.findIndex(
      (task: Task) => task.id === id
    );

    if (taskIndex !== -1) {
      const task = this.tasksArray[taskIndex];
      task.isCompleted = !task.isCompleted;
      await taskService.editStatus(task);
      this.renderTasks();
    }
  }

  async renderTasks(): Promise<void> {
    const tasks: Task[] = this.tasksArray;

    const tasksContainer: HTMLElement | null =
      document.querySelector('.tasks-container');

    if (tasksContainer) {
      tasksContainer.innerHTML = '';

      tasks.forEach((task: Task) => {
        const singleTaskContainer = document.createElement('div');

        singleTaskContainer.style.display = 'flex';
        singleTaskContainer.style.justifyContent = 'space-between';
        singleTaskContainer.style.alignItems = 'center';
        singleTaskContainer.style.padding = '10px';
        singleTaskContainer.style.marginBottom = '5px';
        singleTaskContainer.style.backgroundColor = '#444444';
        singleTaskContainer.style.borderRadius = '10px';
        singleTaskContainer.style.color = 'whitesmoke';

        tasksContainer.appendChild(singleTaskContainer);

        const descriptionContainer = document.createElement('div');
        const buttonsContainer = document.createElement('div');

        descriptionContainer.textContent = task.description;

        descriptionContainer.style.textDecoration = task.isCompleted
          ? 'line-through'
          : 'none';
        descriptionContainer.style.flexGrow = '1';
        descriptionContainer.style.marginLeft = '10px';
        descriptionContainer.style.paddingLeft = '10px';
        descriptionContainer.style.paddingRight = '10px';
        descriptionContainer.style.borderLeftColor = 'green';
        descriptionContainer.style.borderLeftWidth = '3px';
        descriptionContainer.style.borderLeftStyle = 'solid';
        descriptionContainer.style.whiteSpace = 'no-wrap';
        descriptionContainer.style.overflow = 'hidden';
        descriptionContainer.style.textOverflow = 'ellipsis';

        singleTaskContainer.appendChild(descriptionContainer);
        singleTaskContainer.appendChild(buttonsContainer);

        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.gap = '3px';

        const deleteTaskButton = document.createElement('button');

        deleteTaskButton.textContent = 'D';

        deleteTaskButton.style.backgroundColor = 'grey';
        deleteTaskButton.style.color = 'white';
        deleteTaskButton.style.borderRadius = '50%';
        deleteTaskButton.style.border = 'none';
        deleteTaskButton.style.cursor = 'pointer';
        deleteTaskButton.style.width = '30px';
        deleteTaskButton.style.height = '30px';
        deleteTaskButton.style.display = 'flex';
        deleteTaskButton.style.alignItems = 'center';
        deleteTaskButton.style.justifyContent = 'center';
        deleteTaskButton.style.transition = 'background-color, 0.3s, ease';

        deleteTaskButton.addEventListener('click', () =>
          this.deleteTask(task.id)
        );

        const toggleTaskButton = document.createElement('button');

        toggleTaskButton.textContent = task.isCompleted ? 'U' : 'C';

        toggleTaskButton.style.backgroundColor = 'grey';
        toggleTaskButton.style.color = 'white';
        toggleTaskButton.style.borderRadius = '50%';
        toggleTaskButton.style.border = 'none';
        toggleTaskButton.style.cursor = 'pointer';
        toggleTaskButton.style.width = '30px';
        toggleTaskButton.style.height = '30px';
        toggleTaskButton.style.display = 'flex';
        toggleTaskButton.style.alignItems = 'center';
        toggleTaskButton.style.justifyContent = 'center';
        toggleTaskButton.style.transition = 'background-color, 0.3s, ease';

        toggleTaskButton.addEventListener('click', () => {
          this.editStatus(task.id);
        });

        const editTaskButton = document.createElement('button');

        editTaskButton.textContent = 'E';

        editTaskButton.style.backgroundColor = 'grey';
        editTaskButton.style.color = 'white';
        editTaskButton.style.borderRadius = '50%';
        editTaskButton.style.border = 'none';
        editTaskButton.style.cursor = 'pointer';
        editTaskButton.style.width = '30px';
        editTaskButton.style.height = '30px';
        editTaskButton.style.display = 'flex';
        editTaskButton.style.alignItems = 'center';
        editTaskButton.style.justifyContent = 'center';
        editTaskButton.style.transition = 'background-color, 0.3s, ease';

        editTaskButton.addEventListener('click', () => {
          const editInput = document.createElement('input');

          editInput.style.width = '70%';
          editInput.style.padding = '10px';
          editInput.style.borderRadius = '20px';
          editInput.style.border = 'none';
          editInput.style.color = 'whitesmoke';
          editInput.style.backgroundColor = '#333333';

          editInput.value = task.description;
          singleTaskContainer.innerHTML = '';
          singleTaskContainer.appendChild(editInput);
          editInput.focus();

          editInput.addEventListener('blur', () => {
            const editedDescription = editInput.value.trim();
            if (editedDescription !== '') {
              this.editDescription(task.id, editedDescription);
              this.renderTasks();
            }
          });
        });

        buttonsContainer.appendChild(deleteTaskButton);
        buttonsContainer.appendChild(editTaskButton);
        buttonsContainer.appendChild(toggleTaskButton);
      });
    }
  }
}

class TaskService {
  constructor() {}

  async getTasks(): Promise<Task[]> {
    const data = await fetch('http://localhost:3000/tasks').then((response) =>
      response.json()
    );
    return data;
  }

  async addTask(task: Task): Promise<void> {
    try {
      await fetch('http://localhost:3000/tasks', {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async deleteTask(task: Task): Promise<void> {
    try {
      await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      });
    } catch (error) {
      console.log(error);
    }
  }

  async editDescription(task: Task): Promise<void> {
    try {
      await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.log(error);
    }
  }

  async editStatus(task: Task): Promise<void> {
    try {
      await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify(task),
      });
    } catch (error) {
      console.log(error);
    }
  }
}

const taskService = new TaskService();
const taskManager = new TaskManager();
