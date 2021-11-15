import { NgModule } from '@angular/core';
import { LoginComponent } from './login.component';
import { DxFormModule } from 'devextreme-angular';
import { DxTextBoxModule, 
        DxValidatorModule,
        DxValidationSummaryModule
        } from 'devextreme-angular';
import { DxButtonModule } from "devextreme-angular"; 
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    DxFormModule,
    DxTextBoxModule,
    DxValidatorModule,
    DxValidationSummaryModule,
    DxButtonModule
  ],
  exports: [LoginComponent]
})
export class LoginModule { }
