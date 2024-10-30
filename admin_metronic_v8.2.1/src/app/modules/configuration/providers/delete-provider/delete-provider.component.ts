import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProviderService } from '../service/provider.service';

@Component({
  selector: 'app-delete-provider',
  templateUrl: './delete-provider.component.html',
  styleUrls: ['./delete-provider.component.scss']
})
export class DeleteProviderComponent {

  @Output() ProveedorDelete: EventEmitter<any> = new EventEmitter();
  @Input() PROVEEDOR_SELECTED: any;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public providerService: ProviderService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.providerService.deleteProvider(this.PROVEEDOR_SELECTED.id).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Provvedor se Eliminó Correctamente");
        this.ProveedorDelete.emit(resp.provider);
        this.modal.close();
      }

    })
  }

}
