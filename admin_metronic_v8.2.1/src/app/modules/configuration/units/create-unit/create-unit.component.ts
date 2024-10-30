import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UnitService } from '../service/unit.service';

@Component({
  selector: 'app-create-unit',
  templateUrl: './create-unit.component.html',
  styleUrls: ['./create-unit.component.scss']
})
export class CreateUnitComponent {

  @Output() UnitCreate: EventEmitter<any> = new EventEmitter();
  name: string = '';
  description: string = '';
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA UNIDAD ES OBLIGATORIO");
      return false;
    }


    let data = {
      name: this.name,
      description: this.description,
    }
    this.unitService.registerUnit(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Unidad se Registró Correctamente");
        this.UnitCreate.emit(resp.unit);//unit del controller store
        this.modal.close();
      }

    })
  }
}
