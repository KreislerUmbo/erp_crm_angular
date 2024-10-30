import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { UnitService } from '../service/unit.service';
import { DeleteTransformsUnitComponent } from '../delete-transforms-unit/delete-transforms-unit.component';

@Component({
  selector: 'app-create-transforms-unit',
  templateUrl: './create-transforms-unit.component.html',
  styleUrls: ['./create-transforms-unit.component.scss']
})
export class CreateTransformsUnitComponent {

  //@Output() UnitCreate: EventEmitter<any> = new EventEmitter();
  @Input() UNIDAD_SELECTED: any;
  @Input() UNITS: any = [];

  unit_id: string = '';
  unit_to_id: string = '';
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public unitService: UnitService,
    public toast: ToastrService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {

  }

  store() {
    if (!this.unit_to_id) {
      this.toast.error("Validacion:", "EL NOMBRE DE LA UNIDAD ES OBLIGATORIO");
      return false;
    }


    let data = {
      unit_id: this.UNIDAD_SELECTED.id,
      unit_to_id: this.unit_to_id,

    }
    this.unitService.registerUnitTransform(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Unidad se Registró Correctamente");
        // this.UnitCreate.emit(resp.unit);//unit del controller store
        this.UNIDAD_SELECTED.transforms.unshift(resp.unit);
        // this.modal.close();
      }

    })
  }

  removeUnitTransform(transform: any) {
    const modalRef = this.modalService.open(DeleteTransformsUnitComponent, { centered: true, size: 'sm' });
    modalRef.componentInstance.TRANSFORM_SELECTED = transform;
    modalRef.componentInstance.TransformDelete.subscribe((unit_s: any) => {
      let INDEX = this.UNIDAD_SELECTED.transforms.findIndex((unit_select: any) => unit_select.id == transform.id)
      if (INDEX != -1) {
        this.UNIDAD_SELECTED.transforms.splice(INDEX, 1);
      }
    })
  }

}
