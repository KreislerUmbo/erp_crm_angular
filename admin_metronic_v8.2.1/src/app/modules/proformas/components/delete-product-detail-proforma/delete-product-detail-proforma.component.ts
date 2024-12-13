import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-product-detail-proforma',
  templateUrl: './delete-product-detail-proforma.component.html',
  styleUrls: ['./delete-product-detail-proforma.component.scss']
})
export class DeleteProductDetailProformaComponent {


  @Output() DeleteProductProforma: EventEmitter<any> = new EventEmitter();
  @Input() DETAIL_PRODUCT: any;

  isLoading: any;

  constructor(
    public modal: NgbActiveModal,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {

  }


  delete() {
    this.DeleteProductProforma.emit("");
    this.modal.close();
  }

}
