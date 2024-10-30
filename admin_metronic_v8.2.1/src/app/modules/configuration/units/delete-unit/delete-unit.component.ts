import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../service/unit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-unit',
  templateUrl: './delete-unit.component.html',
  styleUrls: ['./delete-unit.component.scss']
})
export class DeleteUnitComponent {

  @Output() UnidadDelete: EventEmitter<any> = new EventEmitter();
  @Input() UNIDAD_SELECTED: any;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.unitService.deleteUnit(this.UNIDAD_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "LA UNIDAD HA SIDO ELIMINADO");
        this.UnidadDelete.emit(resp.message); //PUEDE SER message o unit
        this.modal.close();
      }

    })
  }

}
