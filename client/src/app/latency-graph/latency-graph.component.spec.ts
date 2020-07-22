import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatencyGraphComponent } from './latency-graph.component';

describe('LatencyGraphComponent', () => {
  let component: LatencyGraphComponent;
  let fixture: ComponentFixture<LatencyGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatencyGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatencyGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
