import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../service/provider.service';

@Component({
  selector: 'app-edit-provider',
  templateUrl: './edit-provider.component.html',
  styleUrls: ['./edit-provider.component.scss']
})
export class EditProviderComponent {

  @Output() ProveedorEdit: EventEmitter<any> = new EventEmitter();//sale a listprovider
  @Input() PROVEEDOR_SELECTED: any; //ingresa del listprovider

  isLoading: any;
  razon_soc: string = '';
  name_comercial: string = '';
  ruc: string = '';
  email: string = '';
  phone: string = '';
  address: string = '';
  otros_datos: string = '';
  image_provider: any;
  image_previsualiza: any;
  state:number=1;

  constructor(
    public modal: NgbActiveModal,
    public providerService: ProviderService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.razon_soc = this.PROVEEDOR_SELECTED.razon_soc;
    this.name_comercial = this.PROVEEDOR_SELECTED.name_comercial;
    this.ruc = this.PROVEEDOR_SELECTED.ruc;
    this.email = this.PROVEEDOR_SELECTED.email;
    this.phone = this.PROVEEDOR_SELECTED.phone;
    this.address = this.PROVEEDOR_SELECTED.address;
    this.otros_datos = this.PROVEEDOR_SELECTED.otros_datos;
    this.address = this.PROVEEDOR_SELECTED.address;
    this.image_previsualiza = this.PROVEEDOR_SELECTED.imagen //seteamos la imagena al formulalrio en imageprevsuliza  
    this.state = this.PROVEEDOR_SELECTED.state;
  }


  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) { //validamos para tipo de archivo jpg,png 
      this.toast.warning("WARM", "El archivo no es una imagen");
      return false;
    }

    this.image_provider = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.image_provider);
    reader.onloadend = () => this.image_previsualiza = reader.result;
  }


  store() {
    if (!this.razon_soc) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA RAZON SOCIAL ES OBLIGATORIO");
      return false;
    }

    if (!this.ruc) {
      this.toast.error("Validacion:", "EL RUC ES OBLIGATORIO");
      return false;
    }
    if (!this.phone) {
      this.toast.error("Validacion:", "EL TELEFONO ES OBLIGATORIO");
      return false;
    }
    if (!this.email) {
      this.toast.error("Validacion:", "EL CORREO ES OBLIGATORIO");
      return false;
    }
    if (!this.email) {
      this.toast.error("Validacion:", "LA DIRECCION ES OBLIGATORIO");
      return false;
    }

    let formData = new FormData();
    formData.append("razon_soc", this.razon_soc);
    formData.append("name_comercial", this.name_comercial);
    formData.append("ruc", this.ruc);
    if (this.email) {
      formData.append("email", this.email);
    } else {
      formData.append("email", "");
    }
    if (this.phone) {
      formData.append("phone", this.phone);
    } else {
      formData.append("phone", "");
    }
    if (this.address) {
      formData.append("address", this.address);
    } else {
      formData.append("address", "");
    }

    formData.append("otros_datos", this.otros_datos);
    if (this.image_provider) {
      formData.append("provider_imagen", this.image_provider); //provider_imagen viene del controlador hasFile de store
    }

    formData.append("state", this.state + "");

    this.providerService.updateProvider(this.PROVEEDOR_SELECTED.id, formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Proveedor se Editó Correctamente");
        this.ProveedorEdit.emit(resp.provider);
        this.modal.close();
      }

    })
  }

}
