import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { sds } from '@gsa-sam/sam-styles/src/icons/';
import { fas } from '@fortawesome/free-solid-svg-icons';

import { SamFooterModule } from './common/sam-footer/sam-footer.module';
import { SamHeaderModule } from './common/sam-header/sam-header.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LatencyGraphComponent } from './latency-graph/latency-graph.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AddsiteComponent } from './addsite/addsite.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LatencyGraphComponent,
    AddsiteComponent
  ],
  imports: [
    BrowserAnimationsModule,
    FontAwesomeModule,
    BrowserModule,
    SamFooterModule,
    SamHeaderModule,
    AppRoutingModule,
    NgxChartsModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
   library.add(fas, sds);
  }
}
