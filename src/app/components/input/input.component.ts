import { Component, EventEmitter, Output } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  task: {taskName: string, completed: boolean} = {
    taskName: '',
    completed: false
  }
  
  taskIsValid: boolean = true
  shouldShowAddingMsg: boolean = false

  constructor(private tasksService: TasksService) {}

  async addATask(taskToAdd: {taskName: string, completed: boolean}) { 
    if (this.task.taskName.trim() !== '') {
      await this.tasksService.addTask(taskToAdd)
      this.task.taskName = ''
      this.shouldShowAddingMsg = true
      setTimeout(() => {
        this.shouldShowAddingMsg = false
      }, 1000)
    } else {
      this.taskIsValid = false;
      setTimeout(() => {
        this.taskIsValid = true;
      }, 3000)
    }
  }
}
