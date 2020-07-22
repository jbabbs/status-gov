import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SamFooterComponent } from './sam-footer.component';

@NgModule({
  declarations: [SamFooterComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [SamFooterComponent],
})
export class SamFooterModule { }
