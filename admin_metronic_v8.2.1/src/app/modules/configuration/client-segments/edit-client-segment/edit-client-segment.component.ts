import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ClientSegmentService } from '../service/client-segment.service';

@Component({
  selector: 'app-edit-client-segment',
  templateUrl: './edit-client-segment.component.html',
  styleUrls: ['./edit-client-segment.component.scss']
})
export class EditClientSegmentComponent {
 
  @Output() SegmentClientEdit: EventEmitter<any> = new EventEmitter();
  @Input() SEGMENTCLIENT_SELECTED:any;
  name: string = '';
  state:number=1;
  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public clientSegmentService: ClientSegmentService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.name=this.SEGMENTCLIENT_SELECTED.name;
    this.state=this.SEGMENTCLIENT_SELECTED.state;
  }


  store() {
    if (!this.name) {
      this.toast.error("Validacion:", "EL NOMBRE DEL SEGMENTO DEL CLIENTE ES OBLIGATORIO");
      return false;
    }

    let data = {
      name: this.name,
      state:this.state,
    }
    this.clientSegmentService.updateClientSegments(this.SEGMENTCLIENT_SELECTED.id,data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "La Sucursal se Registró Correctamente");
        this.SegmentClientEdit.emit(resp.client_segment);
        this.modal.close();
      }

    })
  }

}
