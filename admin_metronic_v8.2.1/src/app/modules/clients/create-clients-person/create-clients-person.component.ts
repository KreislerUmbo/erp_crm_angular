import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientsService } from '../service/clients.service';
import { UBIGEO_REGIONES } from 'src/app/config/ubigeo_regiones';
import { UBIGEO_PROVINCIA } from 'src/app/config/ubigeo_provincias';
import { UBIGEO_DISTRITOS } from 'src/app/config/ubigeo_distritos';

@Component({
  selector: 'app-create-clients-person',
  templateUrl: './create-clients-person.component.html',
  styleUrls: ['./create-clients-person.component.scss']
})
export class CreateClientsPersonComponent {

  @Output() CientPersonCreate: EventEmitter<any> = new EventEmitter();
  @Input() client_segments: any = [];
  @Input() asesores: any = [];
  @Input() tipo_document_idents: any = [];

  name: string = '';
  surname: string = '';
  client_segment_id: string = '';
  type_document_id: string = '';
  nro_document: number = 0;
  origen: string = '';
  sexo: number = 0;
  birthdate: any = null;
  phone: string = '';
  email: string = '';
  address: string = '';

  REGIONES: any = UBIGEO_REGIONES;
  PROVINCIAS: any = UBIGEO_PROVINCIA;//esto viene de los archivos 
  DISTRITOS: any = UBIGEO_DISTRITOS;

  PROVINCIA_SELECTEDS: any = [];//esto es para deplegar las provincias seleccionadas de las regionesque msotrara el html
  DISTRITO_SELECTEDS: any = [];

  tab_selected: number = 1;
  ubigeo_region: string = '';
  ubigeo_provincia: string = '';
  ubigeo_distrito: string = '';
  region: string = '';
  provincia: string = '';
  distrito: string = '';
  is_parcial: number = 1;
  asesor_id: string = '';
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public clientService: ClientsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  changeRegion($event: any) {
    // console.log($event.target.value);
    let REGION_ID = $event.target.value;
    let REGION_SELECTED = this.REGIONES.find((region: any) => region.id == REGION_ID);
    if (REGION_SELECTED) {
      this.region = REGION_SELECTED.name;
    }
    let provincias = this.PROVINCIAS.filter((provincia: any) => provincia.department_id == REGION_ID);
    //console.log(provincias);
    this.PROVINCIA_SELECTEDS = provincias;
  }

  changeProvincia($event: any) {
    //console.log($event.target.value);
    let PROVINCIA_ID = $event.target.value;
    let PROVINCIA_SELECTED = this.PROVINCIAS.find((prov: any) => prov.id == PROVINCIA_ID);
    if (PROVINCIA_SELECTED) {
      this.provincia = PROVINCIA_SELECTED.name;
    }
    let distrito = this.DISTRITOS.filter((distrito: any) => distrito.province_id == PROVINCIA_ID);
    // console.log(distritos);
    this.DISTRITO_SELECTEDS = distrito;
  }


  selectedTab(val: number) {
    this.tab_selected = val
  }

  selectedParcial() {
    this.is_parcial = this.is_parcial == 1 ? 2 : 1;//es para el tema de los adelantos
  }

  store() {
    if (!this.nro_document) {
      this.toast.error("Validacion:", "EL nRO DE DOCUMETNO DL CLIENTE ES OBLIGATORIO");
      return false;
    }
    if (!this.name || !this.surname || !this.type_document_id || !this.client_segment_id ) {
      this.toast.error("Validacion:", "EL NOMBRE/APELLIDO/ TYPO DE DOCUMENTO/SEGMENTO DEL CLIENTE ES OBLIGATORIO");
      return false;
    }
    if (!this.sexo || !this.birthdate || !this.phone || !this.address) {
      this.toast.error("Validacion:", "EL SEX0/CUMPLEAÑOS/TELEFONO SON CAMPOS OBLIGATORIO");
      return false;
    }
    if (!this.ubigeo_region || !this.ubigeo_provincia || !this.ubigeo_distrito) {
      this.toast.error("Validacion:", "LA REGION/PROVINCIA/DISTRITO SON CAMPOS OBLIGATORIO");
      return false;
    }


    let DISTRITO_SELECTED = this.DISTRITOS.find((distr: any) => distr.id == this.ubigeo_distrito);
    if (DISTRITO_SELECTED) {
      this.distrito = DISTRITO_SELECTED.name;
    }


    let data = {
      name: this.name,
      surname: this.surname,
      full_name: this.name + ' ' + this.surname,
      client_segment_id: this.client_segment_id,
      type_document_id: this.type_document_id,
      nro_document: this.nro_document,
      origen: this.origen,
      sexo: this.sexo,
      birthdate: this.birthdate,
      phone: this.phone,
      email: this.email,
      address: this.address,
      ubigeo_region: this.ubigeo_region,
      ubigeo_provincia: this.ubigeo_provincia,
      ubigeo_distrito: this.ubigeo_distrito,
      region: this.region,
      provincia: this.provincia,
      distrito: this.distrito,
      is_parcial: this.is_parcial,
      asesor_id: this.asesor_id,
      type: 1,
    }
    this.clientService.registerClientPerson(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El  Cliente Persona se Registró Correctamente");
        this.CientPersonCreate.emit(resp.client);//client del controller store
        this.modal.close();
      }

    })
  }

}