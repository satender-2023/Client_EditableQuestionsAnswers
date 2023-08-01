import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeResourceUrlPipe } from '../pipes/safe-resource-url.pipe';



@NgModule({
  declarations: [SafeResourceUrlPipe],
  imports: [
    CommonModule
  ],
  exports: [SafeResourceUrlPipe]
})
export class SharedModule { }
