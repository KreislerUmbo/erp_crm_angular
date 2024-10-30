import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-create-roles',
  templateUrl: './create-roles.component.html',
  styleUrls: ['./create-roles.component.scss']
})
export class CreateRolesComponent {
  
  @Output() RoleC:EventEmitter<any>=new EventEmitter();
  name: string = '';

  isLoading: any;
  SIDEBAR: any = SIDEBAR;

  permisions: any = [];

  constructor(
    public modal: NgbActiveModal,
    public rolesService: RolesService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  addPermission(permiso: string) {
    let INDEX = this.permisions.findIndex((perm: string) => perm == permiso);
    if (INDEX != -1) {
      this.permisions.splice(INDEX, 1);  //splice quita el checket 
    } else {
      this.permisions.push(permiso);//push agrega permiso
    }
    console.log(this.permisions);
  }

  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "El Nombre es Requerido");
      return false;
    }

    if (this.permisions.length == 0) {
      this.toast.error("Validacion:", "Necesitas Seleccionar un Permiso");
      return false;
    }


    let data = {
      name: this.name,
      permisions: this.permisions,
    }
    this.rolesService.registerRole(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message==403) {
        this.toast.error("Validacion",resp.message_text);
      }else
      {
        this.toast.success("Exito","El Rol se Registró Correctamente");
        this.RoleC.emit(resp.role);
        this.modal.close();
      }
      
    })
  }
}
