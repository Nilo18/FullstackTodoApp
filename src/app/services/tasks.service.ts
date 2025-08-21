import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';
import { DecodedToken } from './auth.service';
import { firstValueFrom } from 'rxjs';

// interfaces mus always be above decorators
export interface Task {
  userId: number,
  taskName: string, 
  completed: boolean
}

@Injectable({
  providedIn: 'root'
})


export class TasksService {

  constructor(private http: HttpClient) { }
  private baseURL = 'https://fullstacktodoapp-back-2-0.onrender.com/'
  // BehaviorSubject is used to keep the latest value of the observable and emit to subscribers immediately
  private tasksSubject = new BehaviorSubject<any[]>([]) 
  tasks$ = this.tasksSubject.asObservable() // asObservable() exposes the BehaviorSubject as the regular observable

  createHeader(accessToken: string | null) {
    return new HttpHeaders({
      Authorization: `Bearer ${accessToken}`
    })
  }

  async getAllTasks(accessToken: string | null) {
    try {
      const headers = this.createHeader(accessToken)
      // The backend expects the access token to be sent as a header
      // It is build that way to ensure that no one can make requests without having an access token
      const tasks = await this.http.get<any>(this.baseURL, {headers, withCredentials: true}).toPromise()
      this.tasksSubject.next(tasks) // next() changes the value of the subject
    } catch(err) {
      console.log('Error', err)
      throw err
    }

  }

  // ******* Access token will be required in these methods as well ********
  async addTask(task: Task, accessToken: string | null) {
    try {
      const headers = this.createHeader(accessToken)
      const newTask = await this.http.post(this.baseURL, task, {headers, withCredentials: true}).toPromise() // .toPromise() converts the observable into a promise so we can await it
      const current = this.tasksSubject.getValue() // get the current value
      this.tasksSubject.next([...current, newTask]) // Pass the value to the BehaviorSubject observer
      return newTask;
    } catch(err) {
      console.log(err)
      throw new Error("Couldn't add task")
    }

  }

  async updateTask(id: string, updatedFields: any, accessToken: string | null) {
    try {
      // updatedTask is returned from backend
      const headers = this.createHeader(accessToken)
      const updatedTask = await firstValueFrom(this.http.put(this.baseURL, {id, ...updatedFields}, {headers, withCredentials: true}))
      const current = this.tasksSubject.getValue()
      // If the id of an object in the tasks array matches the given id, change it to the updated task because that was the changed task
      // Else keep it the same
      const newTasks = current.map(t => t._id === id? updatedTask : t) 
      this.tasksSubject.next(newTasks)
      return updatedTask
    } catch (err) {
      console.log("Couldn't update the task. ", err)
      throw new Error("Couldn't update the task. ")
    }

  }

  async deleteTask(id: string, accessToken: string | null) {
    try {
      const headers = this.createHeader(accessToken)
      await firstValueFrom(this.http.delete(this.baseURL, {headers, body: {id}, withCredentials: true}))
      const current = this.tasksSubject.getValue()
      // Filter out all the tasks which don't match the given id, this way only the deleted task will be left out
      const newTasks = current.filter(t => t._id !== id)
      this.tasksSubject.next(newTasks)
      return id // id of the task which was deleted
    } catch (err) {
      console.log("Couldn't delete task.", err)
      throw new Error("Couldn't delete task.")
    }

  }
}
