import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../service/users.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent {

  @Output() UserC: EventEmitter<any> = new EventEmitter();
  @Input() roles: any = [];
  isLoading: any;

  name: string = '';
  surname: string = '';
  email: string = '';
  phone: string = '';
  role_id: string = '';
  gender: string = '';
  type_document: string = 'DNI';
  nro_document: string = '';
  address: string = '';

  image_previsualiza: any;
  file_name: any;
  password: string = '';
  password_repeat: string = '';
  constructor(
    public modal: NgbActiveModal,
    public usersService: UsersService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toast.warning("WARM", "El archivo no es una imagen");
      return false;
    }
    
    this.file_name = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.file_name);
    reader.onloadend = () => this.image_previsualiza = reader.result;
  }

  store() {

    if (!this.name) {
      this.toast.error("Validacion:", "El Nombre es Requerido");
      return false;
    }
    if (!this.type_document || !this.nro_document) {
      this.toast.error("Validacion:", "El tipo de documento y el numero es requerido");
      return false;
    }

    if (!this.email) {
      this.toast.error("Validacion:", "El email es Requerido");
      return false;
    }
    if (!this.phone) {
      this.toast.error("Validacion:", "El Telefono es Requerido");
      return false;
    }
    if (!this.gender) {
      this.toast.error("Validacion:", "La Opcion Genero es Requerido");
      return false;
    }
    if (!this.role_id) {
      this.toast.error("Validacion:", "El Rol es Requerido");
      return false;
    }
    if (!this.password) {
      this.toast.error("Validacion:", "La constraseña es obligatorio");
      return false;
    }
    if (this.password && this.password != this.password_repeat) {
      this.toast.error("Validacion:", "La constraseñ no coinciden");
      return false;
    }

    let formData = new FormData();
    formData.append("name", this.name);
    formData.append("surname", this.surname);
    formData.append("email", this.email);
    formData.append("phone", this.phone);
    formData.append("role_id", this.role_id);
    formData.append("gender", this.gender);
    formData.append("type_document", this.type_document);
    formData.append("nro_document", this.nro_document);

    if (this.address) {
      formData.append("address", this.address);
    }
    formData.append("password", this.password);
    formData.append("imagen", this.file_name);


    this.usersService.registerUser(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Usuario se Registró Correctamente");
        this.UserC.emit(resp.user);
        this.modal.close();
      }

    })
  }

}
