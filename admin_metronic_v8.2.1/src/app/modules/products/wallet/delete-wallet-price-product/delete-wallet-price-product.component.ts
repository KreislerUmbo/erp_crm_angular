import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductWalletsService } from '../../service/product-wallets.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-wallet-price-product',
  templateUrl: './delete-wallet-price-product.component.html',
  styleUrls: ['./delete-wallet-price-product.component.scss']
})
export class DeleteWalletPriceProductComponent {
  @Output() WalletDelete: EventEmitter<any> = new EventEmitter();
  @Input() WALLET_PRODUCT: any;
  isLoading: any;
  
  constructor(
    public modal: NgbActiveModal,
    public productWalletService: ProductWalletsService,
    public toast: ToastrService,
  ) {

  }
  ngOnInit(): void {

  }
  delete() {
    this.productWalletService.deleteProductWallet(this.WALLET_PRODUCT.id).subscribe((resp: any) => {
      console.log();
      if (resp.message == 403) {
        this.toast.error("Validación", resp.message_text);
      } else {
        this.toast.success("Exito", "El precio del prodcto se eliminó correctamente");
        this.WalletDelete.emit(resp.message);
        this.modal.close();
      }
    })
  }

}
