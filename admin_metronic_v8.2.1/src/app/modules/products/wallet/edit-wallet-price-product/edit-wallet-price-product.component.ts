import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ProductWalletsService } from '../../service/product-wallets.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-edit-wallet-price-product',
  templateUrl: './edit-wallet-price-product.component.html',
  styleUrls: ['./edit-wallet-price-product.component.scss']
})
export class EditWalletPriceProductComponent {

  @Output() WalletEdit: EventEmitter<any> = new EventEmitter();
  @Input() WALLET_PRODUCT: any;
  @Input() UNITS: any = [];
  @Input() SUCURSALES: any = [];
  @Input() CLIENT_SEGMENTS: any = [];

  isLoading: any;

  unit_precio_multiple: string = '';
  sucursale_precio_multiple: string = '';
  segmentclient_precio_multiple: string = '';
  precio_multiple: number = 0;

  constructor(
    public modal: NgbActiveModal,
    public productWalletsService: ProductWalletsService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit(): void {
    this.unit_precio_multiple = this.WALLET_PRODUCT.unit.id
    this.sucursale_precio_multiple = this.WALLET_PRODUCT.sucursale ? this.WALLET_PRODUCT.sucursale.id : ''
    this.segmentclient_precio_multiple = this.WALLET_PRODUCT.client_segment ? this.WALLET_PRODUCT.client_segment.id : '';
    this.precio_multiple = this.WALLET_PRODUCT.precio;
  }


  store() {

    let data = {
      unit_id: this.unit_precio_multiple,
      client_segment_id: this.segmentclient_precio_multiple,
      sucursal_id: this.sucursale_precio_multiple,
      price_general: this.precio_multiple,
    }
    this.productWalletsService.updateProductWallet(this.WALLET_PRODUCT.id, data).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.toast.error("Validacion", resp.message_text);
      } else {
        this.toast.success("Exito", "El Precio del producto ha sido editada correctamente");
        this.WalletEdit.emit(resp.product_wallet);
        this.modal.close();
      }
    })
  }

}
