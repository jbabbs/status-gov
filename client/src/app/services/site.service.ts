import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ISite } from '../../../../interface/site';

export type SinceType = '24H'|'1WEEK'|'10minutes';

@Injectable({
  providedIn: 'root'
})
export class SiteService {

  constructor(private httpClient: HttpClient) {

  }

  getSiteById(id: number|string, since: SinceType): Observable<ISite> {
    const options = {
      params: {
        since
      }
    };
    return this.httpClient.get<ISite>('/sites/' + id, options);
  }

  getAllSites(): Observable<Array<ISite>> {
    return this.httpClient.get<Array<ISite>>('/sites');
  }

  createSite(site: ISite) {
    return this.httpClient.post('/sites', site);
  }
}
