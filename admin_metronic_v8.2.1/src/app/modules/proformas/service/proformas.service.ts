import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from '../../auth';
import { BehaviorSubject, Observable } from 'rxjs';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ProformasService {

  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  searchClients(nro_document: string, full_name: string, phone: string) {
    let LINK = "";
    if (nro_document) {
      LINK += "&nro_document=" + nro_document;
    }
    if (full_name) {
      LINK += "&full_name=" + full_name;
    }
    if (phone) {
      LINK += "&phone=" + phone;
    }

    let URL = URL_SERVICIOS + "/proformas/search-clients?p=1" + LINK;
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    return this.http.get(URL, { headers: headers });
  }

}
