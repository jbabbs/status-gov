import { Component, OnInit } from '@angular/core';
import { LocationStrategy } from '@angular/common';

@Component({
  selector: 'sam-footer',
  templateUrl: './sam-footer.component.html',
  styleUrls: ['./sam-footer.component.scss']
})
export class SamFooterComponent implements OnInit {

  public constructor(public locationStrategy: LocationStrategy) { }

  ngOnInit() {
  }

}