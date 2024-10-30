import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ClientSegmentService } from '../service/client-segment.service';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
//import { EventEmitter } from 'stream';

@Component({
  selector: 'app-delete-client-segment',
  templateUrl: './delete-client-segment.component.html',
  styleUrls: ['./delete-client-segment.component.scss']
})
export class DeleteClientSegmentComponent {

  @Output() SegmentClientDelete: EventEmitter<any> = new EventEmitter();
  @Input() SEGMENTCLIENT_SELECTED: any;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public clientSegmentService: ClientSegmentService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.clientSegmentService.deleteClientSegments(this.SEGMENTCLIENT_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "EL SEGMENTO DE CLIENTE HA SIDO ELIMINADO");
        this.SegmentClientDelete.emit(resp.message); //PUEDE SER message o sucursals
        this.modal.close();
      }

    })
  }

}
