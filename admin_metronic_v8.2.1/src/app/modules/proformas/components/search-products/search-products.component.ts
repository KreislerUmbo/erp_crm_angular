import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-search-products',
  templateUrl: './search-products.component.html',
  styleUrls: ['./search-products.component.scss']
})
export class SearchProductsComponent {

  @Input() products: any = [];
  @Output() ProductSelected: EventEmitter<any> = new EventEmitter();

  constructor(
    public modal: NgbActiveModal,
  ) {

  }

  getDisponibilidad(val: number) {
    let TEXTO = "";
    switch (val) {
      case 1:
        TEXTO = "Vender productos sin stock";
        break;

      case 2:
        TEXTO = "NO vender los productos sin stock";
        break;

      case 3:
        TEXTO = "Proyectar con los contratos que se tenga";
        break;

      default:
        break;
    }

    return TEXTO;
  }

  getTipoImpuesto(val: number) {
    let TEXTO = "";
    switch (val) {
      case 0:
        TEXTO = "Libre de impuestos";
        break;

      case 1:
        TEXTO = "Bienes sujetos a impuestos";
        break;

      case 2:
        TEXTO = "Producto descargable";
        break;

      default:
        break;
    }
    return TEXTO;
  }

  ngOnInit(): void {
    console.log(this.products);
  }

  
  selectProduct(product: any)//selectProduct tiene que estar en el html search-produts.componets.html
   {
    this.ProductSelected.emit(product);
    this.modal.close();
  }

}
