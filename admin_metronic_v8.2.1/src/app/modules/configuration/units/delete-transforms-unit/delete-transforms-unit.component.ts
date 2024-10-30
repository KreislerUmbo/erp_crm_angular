import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../service/unit.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-transforms-unit',
  templateUrl: './delete-transforms-unit.component.html',
  styleUrls: ['./delete-transforms-unit.component.scss']
})
export class DeleteTransformsUnitComponent {

  @Output() TransformDelete: EventEmitter<any> = new EventEmitter();
  @Input() TRANSFORM_SELECTED: any;

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
    this.unitService.deleteUnitTransform(this.TRANSFORM_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "LA UNIDAD  DE TRANSFORMACION SE HA ELIMINADO CORRECTAMENTE");
        this.TransformDelete.emit(resp.message); //PUEDE SER message o unit
        this.modal.close();
      }

    })
  }

}
