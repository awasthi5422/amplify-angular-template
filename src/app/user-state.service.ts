import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Amplify } from 'aws-amplify';
import { get, post, put, del } from '@aws-amplify/api-rest';
@Injectable({
  providedIn: 'root',
})
export class UserStateService {
  private usersSource = new BehaviorSubject<any[]>([
    { id: 1, name: 'Alice', liked: false },
    { id: 2, name: 'Bob', liked: false },
    { id: 3, name: 'Charlie', liked: false },
  ]);
  users$ = this.usersSource.asObservable();
  private apiName = 'myRestApi';
  private apiPath = '/items';
  constructor() {}

  toggleLike(userId: number) {
    let userData = this.usersSource.value;
    let updatedData = userData.map((user) => {
      return user.id == userId ? { ...user, liked: !user.liked } : user;
    });
    // updated new data
    this.usersSource.next(updatedData);
  }

  // GET all items
  async getItems(): Promise<any> {
    try {
      const response: any = await get({
        apiName: this.apiName,
        path: this.apiPath,
      });
      return response.body;
    } catch (error) {
      console.error('API GET error:', error);
      throw error;
    }
  }

  // POST new item
  async createItem(itemData: any): Promise<any> {
    try {
      const response: any = await post({
        apiName: this.apiName,
        path: this.apiPath,
        options: {
          body: itemData,
        },
      });
      return response.body;
    } catch (error) {
      console.error('API POST error:', error);
      throw error;
    }
  }
}
