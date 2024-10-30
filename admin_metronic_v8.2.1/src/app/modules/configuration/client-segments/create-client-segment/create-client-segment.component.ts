import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientSegmentService } from '../service/client-segment.service';

@Component({
  selector: 'app-create-client-segment',
  templateUrl: './create-client-segment.component.html',
  styleUrls: ['./create-client-segment.component.scss']
})
export class CreateClientSegmentComponent {

  @Output() SegmetCientC: EventEmitter<any> = new EventEmitter();
  name: string = '';
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public clientSegmentService: ClientSegmentService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL SEGMENTO ES OBLIGATORIO");
      return false;
    }


    let data = {
      name: this.name,
    }
    this.clientSegmentService.registerClientSegments(data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Segmento de Cliente se Registró Correctamente");
        this.SegmetCientC.emit(resp.client_segment);//client_segment del controller store
        this.modal.close();
      }

    })
  }

}
