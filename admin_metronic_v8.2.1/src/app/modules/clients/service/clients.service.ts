import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { AuthService } from '../../auth';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {


  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;
  
  constructor(
    private http: HttpClient,
    public authservice: AuthService,
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

   registerClientPerson(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clients";
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }  

    listConfig() {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clients/config";
    return this.http.get(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

  listClients(page = 1,data: any = {}) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clients/index?page=" + page;
    return this.http.post(URL, data,{ headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

 updateClientPerson(ID_CLIENT:string,data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clients/"+ID_CLIENT;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } 

  updateClientCompany(ID_CLIENT:string,data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clients/"+ID_CLIENT;
    return this.http.put(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } 

  /* 
   deleteClientSegments(ID_SEGMENCLIENT:string,) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/client_segments/"+ID_SEGMENCLIENT;
    return this.http.delete(URL, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  } 
 */


  
  inportClients(data: any) {
    this.isLoadingSubject.next(true);
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authservice.token });
    let URL = URL_SERVICIOS + "/clients/import";/// esta ruta debe estar creado en api.php
    return this.http.post(URL, data, { headers: headers }).pipe(
      finalize(() => this.isLoadingSubject.next(false))
    );
  }

}
