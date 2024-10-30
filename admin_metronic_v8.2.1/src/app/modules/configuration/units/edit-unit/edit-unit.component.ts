import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../service/unit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-unit',
  templateUrl: './edit-unit.component.html',
  styleUrls: ['./edit-unit.component.scss']
})
export class EditUnitComponent {

  @Output() UnidadEdit: EventEmitter<any> = new EventEmitter();
  
  @Input() UNIDAD_SELECTED:any;
  name: string = '';
  description: string = '';
  state:number=1;
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.name=this.UNIDAD_SELECTED.name;
    this.description=this.UNIDAD_SELECTED.description;
    this.state=this.UNIDAD_SELECTED.state;
  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA SUCURSAL ES REQUERIDO");
      return false;
    }

    let data = {
      name: this.name,
      description: this.description,
      state:this.state,
    }
    this.unitService.updateUnit(this.UNIDAD_SELECTED.id,data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Unidad se Registró Correctamente");
        this.UnidadEdit.emit(resp.unit);
        this.modal.close();
      }

    })
  }

}
