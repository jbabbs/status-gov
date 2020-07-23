import { Component, OnInit } from '@angular/core';
import { SiteService } from '../services/site.service';
import { ISite } from 'statusgov-interface/site';
import { Router } from '@angular/router';

@Component({
  selector: 'app-addsite',
  templateUrl: './addsite.component.html',
  styleUrls: ['./addsite.component.scss']
})
export class AddsiteComponent implements OnInit {
  name;
  url;

  constructor(private siteService: SiteService, private router: Router) { }

  ngOnInit() {
  }

  onAddSiteClick() {
    const site: any = {
      name: this.name,
      url: this.url,
    } as ISite;
    this.siteService.createSite(site).subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
