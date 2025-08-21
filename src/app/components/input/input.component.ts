import { Component } from '@angular/core';
import { TasksService, Task } from '../../services/tasks.service';
import { AuthService, DecodedToken } from '../../services/auth.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {

  constructor(private tasksService: TasksService, private authService: AuthService) {}
  
  taskIsValid: boolean = true
  shouldShowAddingMsg: boolean = false
  token!: DecodedToken
  task: Task = {
    userId: 0,
    taskName: '',
    completed: false
  }

  ngOnInit() {
    this.authService.accessToken$.subscribe(accessToken => {
      // Wrapped in an if statement to suppress typescript error about null value
      if (accessToken) {
        this.token = jwtDecode<DecodedToken>(accessToken)
        this.task = {
          userId: this.token.userId,
          taskName: '',
          completed: false
        }
      }
    })
  }

  async addATask(taskToAdd: Task) { 
    if (this.task.taskName.trim() !== '') {
      this.authService.accessToken$.subscribe(async (accessToken) => {
        try {
          await this.tasksService.addTask(taskToAdd, accessToken)
        } catch(err) {
          console.log("Couldn't add task", err)
          throw new Error("Couldn't add task")
        }})
      
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
