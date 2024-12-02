import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientsService } from '../service/clients.service';
import { CreateClientsPersonComponent } from '../create-clients-person/create-clients-person.component';
import { CreateClientsCompanyComponent } from '../create-clients-company/create-clients-company.component';
import { EditClientsPersonComponent } from '../edit-clients-person/edit-clients-person.component';
import { EditClientsCompanyComponent } from '../edit-clients-company/edit-clients-company.component';
import { URL_SERVICIOS } from 'src/app/config/config';
import { ImportClientsComponent } from '../import-clients/import-clients.component';

@Component({
  selector: 'app-list-clients',
  templateUrl: './list-clients.component.html',
  styleUrls: ['./list-clients.component.scss']
})
export class ListClientsComponent {


  search: string = '';
  element: boolean = false;
  CLIENTS: any = [];
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  client_segments: any = [];
  asesores: any = [];
  tipo_document_idents: any = [];

  //para la busqueda de segmento de cliente
  client_segment_id: string = '';
  //para la busqueda tipo cliente persona o compañia
  type: string = '';
  //para la busqueda asesor
  asesor_id: string = '';

  constructor(
    public modalService: NgbModal,
    public clientsService: ClientsService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.clientsService.isLoading$;
    this.listClients();
    this.listConfig();
  }

  mostrarBusqueda() {
    return (this.element = true);
  }
  ocultarBusqueda() {
    return (this.element = false);
  }
  listClients(page = 1) {
    let data = {
      search: this.search,
      client_segment_id: this.client_segment_id,
      type: this.type,
      asesor_id: this.asesor_id,
    }

    this.clientsService.listClients(page, data).subscribe((resp: any) => {
      console.log(resp);
      this.CLIENTS = resp.clients.data;// clients-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  resetlistClients() {
    this.search = '';
    this.client_segment_id = '';
    this.type = '';
    this.asesor_id = '';
    this.listClients();
  }

  listConfig() {
    this.clientsService.listConfig().subscribe((resp: any) => {
      console.log(resp);
      this.client_segments = resp.client_segments;
      this.asesores = resp.asesores;
      this.tipo_document_idents = resp.tipo_document_idents;
    })
  }


  loadPage($event: any) {
    this.listClients($event)
  }

  createClientPerson() {
    const modalRef = this.modalService.open(CreateClientsPersonComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.tipo_document_idents = this.tipo_document_idents;
    modalRef.componentInstance.CientPersonCreate.subscribe((client: any) => {
      this.CLIENTS.unshift(client);
    })
  }

  createClientCompany() {
    const modalRef = this.modalService.open(CreateClientsCompanyComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.tipo_document_idents = this.tipo_document_idents;
    modalRef.componentInstance.ClientCompanyCreate.subscribe((client: any) => {
      this.CLIENTS.unshift(client);
    })
  }

  editClientPerson(CLIENT: any) {

    const modalRef = this.modalService.open(EditClientsPersonComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.CLIENT_SELECTED = CLIENT;
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.tipo_document_idents = this.tipo_document_idents;

    modalRef.componentInstance.ClientPersonEdit.subscribe((clientEP: any) => {
      let INDEX = this.CLIENTS.findIndex((client: any) => client.id == CLIENT.id);
      if (INDEX != -1) {
        this.CLIENTS[INDEX] = clientEP;
      }
    })
  }

  editClientCompany(CLIENT: any) {
    const modalRef = this.modalService.open(EditClientsCompanyComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.CLIENT_SELECTED = CLIENT;
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.tipo_document_idents = this.tipo_document_idents;
    modalRef.componentInstance.ClientCompanyEdit.subscribe((clientEC: any) => {
      let INDEX = this.CLIENTS.findIndex((client: any) => client.id == CLIENT.id);
      if (INDEX != -1) {
        this.CLIENTS[INDEX] = clientEC;
      }
    })
  }

  downloadClients() {
    let LINK = "";
    if (this.search) {
      LINK += "&search=" + this.search;
    }
    if (this.client_segment_id) {
      LINK += "&client_segment_id=" + this.client_segment_id;
    }
    if (this.type) {
      LINK += "&type=" + this.type;
    }
    if (this.asesor_id) {
      LINK += "&asesor_id=" + this.asesor_id;
    }
    window.open(URL_SERVICIOS + "/excel/export-clients?z=1" + LINK, "blank")
  }

  importClients() {
    const modalRef = this.modalService.open(ImportClientsComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.importClientsExcel.subscribe((resp: any) => {
      this.listClients();
    })
  }

  deleteClient(CLIENT: any) {

    /*     const modalRef = this.modalService.open(DeleteClientSegmentComponent, { centered: true, size: 'md' });
        modalRef.componentInstance.SEGMENTCLIENT_SELECTED = SEGMENCLIENT;
    
        modalRef.componentInstance.SegmentClientDelete.subscribe((client_segment: any) => {
          let INDEX = this.SEGMENCLIENTS.findIndex((client_segment: any) => client_segment.id == SEGMENCLIENT.id);
          if (INDEX != -1) {
            this.SEGMENCLIENTS.splice(INDEX,1);
          } 
        }) */
  }

}
