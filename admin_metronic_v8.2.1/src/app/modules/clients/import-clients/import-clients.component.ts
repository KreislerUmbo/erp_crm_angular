import { Component, EventEmitter, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClientsService } from '../service/clients.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-import-clients',
  templateUrl: './import-clients.component.html',
  styleUrls: ['./import-clients.component.scss']
})
export class ImportClientsComponent {

  @Output() importClientsExcel: EventEmitter<any> = new EventEmitter();

  isLoading: any;
  file_excel: any;

  constructor(
    public modal: NgbActiveModal,
    public clientsService: ClientsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }

  processFileExcel($event: any) {
    this.file_excel = $event.target.files[0];
  }

  store() {
    if (!this.file_excel) {
      this.toast.error("Validacion:", "EL ARCHIVO ES  OBLIGATORIO");
      return false;
    }


    let formData = new FormData();
    formData.append("import_file", this.file_excel);
    this.clientsService.inportClients(formData).subscribe((resp: any) => { // el inportClients debe estar creado en clients.service
      console.log(resp);
      this.toast.success("Exito", "Los cliente han sido importados correctamente");
      this.importClientsExcel.emit(resp.message);
      this.modal.close();
    }, error => {
      console.log(error);
    })
  }

}
