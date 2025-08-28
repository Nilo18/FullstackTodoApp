import { Component, EventEmitter, Output } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { AuthService } from '../../services/auth.service';
import { HttpHeaders } from '@angular/common/http';
import { Task } from '../../services/tasks.service';

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
  deadlineString: string | null = '' 

  constructor(private tasksService: TasksService, private authService: AuthService) {}

  async ngOnInit() {
    // Subscribe to tasks$ to receive the latest value
    // Convert the deadlines to ISO string for display
    this.tasksService.tasks$.subscribe(tasks => { 
      this.tasks = tasks.map(task => ({
        ...task,
        deadline: task.deadline ? new Date(task.deadline).toISOString().slice(0, 16) : ''
      }))
    }) 
    // console.log()
    const storedToken = localStorage.getItem('accessToken')
    const accessToken = storedToken? JSON.parse(storedToken) : null
    this.token = accessToken
    
    await this.tasksService.getAllTasks(this.token)
  }

  async deleteATask(id: string) {
    await this.tasksService.deleteTask(id, this.token)
  }

  toggleDisabled() {
    this.shouldUpdate = !this.shouldUpdate
  }

  async updateCheckbox(id: string, updatedFields: any) {
    if (this.shouldUpdate) {
      updatedFields.completed = !updatedFields.completed
      this.toggleDisabled() // Disable the checkbox
      await this.tasksService.updateTask(id, updatedFields, this.token)
      setTimeout(() => {
        this.toggleDisabled() // Enable it again after 3 secs
      }, 2000)
    } 
  }

  async updateATask(id: string, updatedFields: any) {
    console.log(id, updatedFields)
    await this.tasksService.updateTask(id, updatedFields, this.token)
  }
}
