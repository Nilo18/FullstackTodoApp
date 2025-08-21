import { Component, EventEmitter, Output } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';

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
  token!: string | null 

  constructor(private tasksService: TasksService, private authService: AuthService) {}

  async ngOnInit() {
    // Subscribe to tasks$ to receive the latest value
    this.tasksService.tasks$.subscribe(tasks => { 
      this.tasks = tasks
    }) 
    // console.log()
    this.authService.accessToken$.subscribe(accessToken => {
      this.token = accessToken
    })

    // If the token is null then refreshAccessToken() will be called and a new token will be fetched from the backend 
    if (!this.token || this.authService.tokenIsExpired()) {
      try {
        this.token = await this.authService.refreshAccessToken();
      } catch(err) {
        console.log(err)
        throw new Error('Failed to refresh')
      }
    }
    this.tasksService.getAllTasks(this.token)
  }

  async deleteATask(id: string) {
    await this.tasksService.deleteTask(id, this.token)
  }

  toggleDisabled() {
    this.shouldUpdate = !this.shouldUpdate
  }

  async updateATask(id: string, updatedFields: any) {
    if (this.shouldUpdate) {
      updatedFields.completed = !updatedFields.completed
      this.toggleDisabled() // Disable the checkbox
      await this.tasksService.updateTask(id, updatedFields, this.token)
      setTimeout(() => {
        this.toggleDisabled() // Enable it again after 3 secs
      }, 3000)
    } 
  }
}
