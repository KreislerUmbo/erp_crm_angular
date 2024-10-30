import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SIDEBAR } from 'src/app/config/config';
import { RolesService } from '../service/roles.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-roles',
  templateUrl: './delete-roles.component.html',
  styleUrls: ['./delete-roles.component.scss']
})
export class DeleteRolesComponent {

  @Output() RoleD: EventEmitter<any> = new EventEmitter();
  @Input() ROLE_SELECTED: any;

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



  delete() {
    this.rolesService.deleteRole(this.ROLE_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Rol se Eliminó Correctamente");
        this.RoleD.emit(resp.role);
        this.modal.close();
      }

    })
  }

}
