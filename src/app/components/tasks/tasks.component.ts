import { Component } from '@angular/core';
import { TasksService } from '../../services/tasks.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss'
})
export class TasksComponent {
  tasks: any[] = []
  taskWasAdded: boolean = false;
  shouldUpdate: boolean = true; // Flag for preventing spamming PUT requests
  // loading: boolean = true;

  constructor(private tasksService: TasksService) {}

  ngOnInit() {
    // Subscribe to tasks$ to receive the latest value
    this.tasksService.tasks$.subscribe(tasks => { 
      this.tasks = tasks
    }) 
    this.tasksService.getAllTasks()
  }

  async deleteATask(id: string) {
    await this.tasksService.deleteTask(id)
  }

  toggleDisabled() {
    this.shouldUpdate = !this.shouldUpdate
  }

  async updateATask(id: string, updatedFields: any) {
    if (this.shouldUpdate) {
      updatedFields.completed = !updatedFields.completed
      this.toggleDisabled() // Disable the checkbox
      await this.tasksService.updateTask(id, updatedFields)
      setTimeout(() => {
        this.toggleDisabled() // Enable it again after 3 secs
      }, 3000)
    } 
  }
}
