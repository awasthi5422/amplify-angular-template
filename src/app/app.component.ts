import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TodosComponent } from './todos/todos.component';
import { Amplify } from 'aws-amplify';
import outputs from '../../amplify_outputs.json';
import * as XLSX from 'xlsx';

import {
  AmplifyAuthenticatorModule,
  AuthenticatorService,
} from '@aws-amplify/ui-angular';
import { UserStateService } from './user-state.service';
import { parseAmplifyConfig } from 'aws-amplify/utils';
Amplify.configure(outputs);

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [RouterOutlet, TodosComponent, AmplifyAuthenticatorModule],
})
export class AppComponent {
  title = 'amplify-angular-template';
  userData: any;
  amplifyConfig = parseAmplifyConfig(outputs);
  constructor(
    public authenticator: AuthenticatorService,
    public userService: UserStateService,
  ) {
    Amplify.configure(
      {
        ...this.amplifyConfig,
        API: {
          ...this.amplifyConfig.API,
          REST: outputs.custom.API,
        },
      },
      {
        API: {
          REST: {
            retryStrategy: {
              strategy: 'no-retry', // Overrides default retry strategy
            },
          },
        },
      },
    );
  }
  
  ngOnInit(): void {
    this.userService.users$.subscribe((data) => {
      this.userData = data;
    });
    // this.loadItems();
  }

  async loadItems() {
    try {
      let data = await this.userService.getItems();
      console.log(data, '>>>>>>>>>>>>>>>>>>>>>>');
    } catch (err) {
      console.error(err);
    }
  }

  downloadXlsxFromBase64(base64Data: string) {
    // Decode Base64 to binary string
    const binaryString = atob(base64Data);

    // Convert binary string to Uint8Array
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create Blob for XLSX
    const blob = new Blob([bytes], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    // Download file
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
