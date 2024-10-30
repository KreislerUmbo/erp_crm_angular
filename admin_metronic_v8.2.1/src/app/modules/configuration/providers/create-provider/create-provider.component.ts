import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../service/provider.service';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss']
})
export class CreateProviderComponent {

  @Output() ProviderCreate: EventEmitter<any> = new EventEmitter();
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

  constructor(
    public modal: NgbActiveModal,
    public providerService: ProviderService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

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


    /*   let data = { 
        name: this.name,
      }se cambia por formdata por la imagen ya no let data */
    let formData = new FormData();
    formData.append("razon_soc", this.razon_soc);
    formData.append("name_comercial", this.name_comercial);
    formData.append("ruc", this.ruc);
    formData.append("email", this.email);
    formData.append("phone", this.phone);
    formData.append("address", this.address);
    formData.append("otros_datos", this.otros_datos);
    if (this.image_provider) {
      formData.append("provider_imagen", this.image_provider); //provider_imagen viene del controlador hasFile de store
    }


    this.providerService.registerProvider(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Proveedor se  Registró Correctamente");
        this.ProviderCreate.emit(resp.provider);//client_segment del controller store
        this.modal.close();
      }

    })
  }
}
