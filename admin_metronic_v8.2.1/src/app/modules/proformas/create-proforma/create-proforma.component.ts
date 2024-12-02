import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientsPersonComponent } from '../../clients/create-clients-person/create-clients-person.component';
import { CreateClientsCompanyComponent } from '../../clients/create-clients-company/create-clients-company.component';
import { ProformasService } from '../service/proformas.service';
import { SearchClientsComponent } from '../components/search-clients/search-clients.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-proforma',
  templateUrl: './create-proforma.component.html',
  styleUrls: ['./create-proforma.component.scss']
})
export class CreateProformaComponent {

  CLIENT_SELECTED: any;
  nro_document: string = '';
  full_name: string = '';
  phone: string = '';
  price: number = 0;
  cantidad: number = 0;

  REGIONES: any = [];
  PROVINCIA_SELECTEDS: any = [];
  DISTRITO_SELECTEDS: any = [];

  ubigeo_region: string = '';
  ubigeo_provincia: string = '';
  ubigeo_distrito: string = '';
  agencia: string = '';

  full_name_encargado: string = '';
  documento_encargado: string = '';
  telefono_encargado: string = '';

  deuda: number = 0;

  isLoading$: any;
  constructor(
    public modalSevice: NgbModal,
    public proformaService: ProformasService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit() {
    this.isLoading$ = this.proformaService.isLoading$;
  }

  isLoadingProccess() {
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);

    }, 50);

  }


  changeRegion($event: any) {

  }
  changeProvincia($event: any) {

  }

  searchClients() {
    this.proformaService.searchClients(this.nro_document, this.full_name, this.phone).subscribe((resp: any) => {
      console.log(resp);

      if (resp.clients.length > 1) {//si hay mas de 1 cliente 
        this.openSelectedClients(resp.clients);
      } else {
        if (resp.clients.length == 1) {  //si hay 1 cliente
          this.CLIENT_SELECTED = resp.clients[0];
          this.isLoadingProccess()
          this.nro_document = this.CLIENT_SELECTED.nro_document;
          this.full_name = this.CLIENT_SELECTED.full_name;
          this.phone = this.CLIENT_SELECTED.phone;
          this.toast.success("Exito", "se seleccionó al cliente de la proforma");
        } else {//si no hay cientes
          this.toast.error("Validacion", "NO hay coincidencia en la busqueda");
        }
      }

    });

  }

  openSelectedClients(clients: any = []) {
    const modalRef = this.modalSevice.open(SearchClientsComponent, { size: 'lg', centered: true });

    modalRef.componentInstance.ClientSelected.subscribe((client: any) => {  // ClientSelected esto viene del componente hijo del output search-clients.components.ts
      this.CLIENT_SELECTED = client;
      this.isLoadingProccess();
      this.nro_document = this.CLIENT_SELECTED.nro_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;
      this.toast.success("Exito", "se seleccionó al cliente de la proforma");
    })

    modalRef.componentInstance.clients = clients
  }

  createClientPerson() {
    const modalRef = this.modalSevice.open(CreateClientsPersonComponent, { size: 'lg', centered: true });
  }
  searchClientCompany() {
    const modalRef = this.modalSevice.open(CreateClientsCompanyComponent, { size: 'lg', centered: true });
  }
}
