import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { A11yModule } from '@angular/cdk/a11y';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SamHeaderComponent } from './sam-header.component';

@NgModule({
  declarations: [SamHeaderComponent],
  imports: [
    CommonModule,
    RouterModule,
    A11yModule,
    FontAwesomeModule
  ],
  exports: [SamHeaderComponent],
})
export class SamHeaderModule { }
