import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) { }
  private baseURL = 'https://fullstacktodoapp-back-2-0.onrender.com/'
  // BehaviorSubject is used to keep the latest value of the observable and emit to subscribers immediately
  private tasksSubject = new BehaviorSubject<any[]>([]) 
  tasks$ = this.tasksSubject.asObservable() // asObservable() exposes the BehaviorSubject as the regular observable
  async getAllTasks(accessToken: any) {
    try {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${accessToken}`
        })

      const tasks = await this.http.get<any>(this.baseURL, {headers, withCredentials: true}).toPromise()
      this.tasksSubject.next(tasks) // next() changes the value of the subject
    } catch(err) {
      console.log('Error', err)
      throw err
    }

  }

  async addTask(task: {taskName: string, completed: boolean}) {
    console.log("Adding task...:", task)
    const newTask = await this.http.post(`${this.baseURL}`, task).toPromise() // .toPromise() converts the observable into a promise so we can await it
    const current = this.tasksSubject.getValue() // get the current value
    this.tasksSubject.next([...current, newTask])
    return newTask;
  }

  async updateTask(id: string, updatedFields: any) {
    // updatedTask is returned from backend
    const updatedTask = await this.http.request('PUT', this.baseURL, {body: {id, ...updatedFields}}).toPromise()
    const current = this.tasksSubject.getValue()
    // If the id of an object in the tasks array matches the given id, change it to the updated task because that was the changed task
    // Else keep it the same
    const newTasks = current.map(t => t._id === id? updatedTask : t) 
    this.tasksSubject.next(newTasks)
    return updatedTask
  }

  async deleteTask(id: string) {
    await this.http.request('DELETE', this.baseURL, {body: {id}}).toPromise() // We use request() here because delete takes different parameters
    const current = this.tasksSubject.getValue()
    // Filter out all the tasks which don't match the given id, this way only the deleted task will be left out
    const newTasks = current.filter(t => t._id !== id)
    this.tasksSubject.next(newTasks)
    return id // id of the task which was deleted
  }
}
