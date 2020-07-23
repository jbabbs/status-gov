import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { ISite } from 'statusgov-interface/site';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  sites: ISite[];

  constructor(
    private siteService: SiteService
  ) { }

  ngOnInit() {
    this.siteService.getAllSites().toPromise().then(sites => {
      this.sites = sites;
    });
  }

}
