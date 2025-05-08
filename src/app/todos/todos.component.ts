import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { generateClient } from 'aws-amplify/data';
import { data, type Schema } from '../../../amplify/data/resource';
import { Subscription } from 'rxjs';

const client = generateClient<Schema>();

interface Todo {
  id: string;
  content: string;
  createdAt: string;
}

@Component({
  selector: 'app-todos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './todos.component.html',
  styleUrl: './todos.component.css',
})
export class TodosComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  private subscription?: Subscription;

  ngOnInit(): void {
    this.subscribeToTodos();
    this.callLambdaFunctions();
  }

  private subscribeToTodos() {
    try {
      this.subscription = client.models.Todo1.observeQuery().subscribe({
        next: ({ items }) => {
          console.log('Fetched todos:', items);
          this.todos = items as Todo[];
        },
        error: (error) => {
          console.error('Error fetching todos:', error);
        },
      });
    } catch (error) {
      console.error('Unexpected error in subscribeToTodos:', error);
    }
  }

  async createTodo() {
    const content = window.prompt('Enter todo content:');
    if (!content) return;
    try {
      await client.models.Todo1.create({
        content,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  }

  async deleteTodo(id: string) {
    try {
      await client.models.Todo1.delete({ id });
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  }

  private async callLambdaFunctions() {
    try {
      const data = await client.queries.hello1();
      console.log('Lambda hello1 response:', data);

      const data1 = await client.queries.hello2();
      console.log('Lambda hello2 response:', data1);
    } catch (error) {
      console.error('Error calling lambda functions:', error);
    }
  }

  ngOnDestroy(): void {
    // Clean up subscription to prevent memory leaks
    this.subscription?.unsubscribe();
  }
}
