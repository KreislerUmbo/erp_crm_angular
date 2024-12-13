import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, fromEvent } from 'rxjs';
import { ProformasService } from '../../service/proformas.service';


@Component({
  selector: 'app-edit-product-detail-proforma',
  templateUrl: './edit-product-detail-proforma.component.html',
  styleUrls: ['./edit-product-detail-proforma.component.scss']
})
export class EditProductDetailProformaComponent {
  @Input() DETAIL_PRODUCT: any;
  @Input() sucursale_asesor: any;
  @Input() CLIENT_SELECTED:any;

  @Output() EditProductProforma:EventEmitter<any>= new EventEmitter();

  //campos para detalle del producto
  description_product: string = '';
  price: number = 0;
  cantidad: number = 0;
  unidad_product: string = '';
  almacen_product: string = '';
  PRODUCT_SELECTED: any;
  loadUnidad: boolean = false;
  /**para busqueda de product en la sucursal */
  warehouses_product: any;
  exist_warehouse: any = [];
  amount_discount: number = 0;//para descuento


  isLoading$: any;
  source: any;//esto es para poder manipular los tiempos de keyup en los descuentos
  @ViewChild("discount") something: ElementRef;

  constructor(
    public modal: NgbActiveModal,
    public toast:ToastrService,
    public proformaService:ProformasService,


  ) {

  }

  ngOnInit(): void {
    this.isLoading$=this.proformaService.isLoading$;
    this.PRODUCT_SELECTED = this.DETAIL_PRODUCT.product;
    this.description_product = this.DETAIL_PRODUCT.descripcion;
    this.price = this.DETAIL_PRODUCT.price_unit;
    this.cantidad = this.DETAIL_PRODUCT.cantidad;
    this.unidad_product = this.DETAIL_PRODUCT.unidad_product;
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh: any) => wareh.unit.id == this.unidad_product);
    this.exist_warehouse = this.warehouses_product.filter((wareh: any) => wareh.warehouse.id == this.sucursale_asesor);
    this.amount_discount=this.DETAIL_PRODUCT.descuento;
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);

    }, 50);
  }

  ngAfterViewInit(): void {
    this.source = fromEvent(this.something.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1200)).subscribe((c: any) => {
      this.verifiedDiscount();
   //   this.isLoadingProccess();
    }
    );
  }

  


  changeUnitProduct($event: any) {
    console.log($event.target.value);

    let UNIT_SELECTED = $event.target.value
    /** sacamos los cantidades de unidade, o cajas aignadas a los almecenes  */
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh: any) => wareh.unit.id == UNIT_SELECTED);
    //validamos que las unidadedes y el almcen esten con el ususario asignado en esa sucursal, sino va aparecer de otras alcenenes que no tienen nada que ver con el ususario del formuarro
    this.exist_warehouse = this.warehouses_product.filter((wareh: any) => wareh.warehouse.id == this.sucursale_asesor);

    //filtro de precio multiple 
    let WALLETS = this.PRODUCT_SELECTED.wallets;

    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);

    }, 50);

    //las condiciones
    //1.-BUSQUEDA POR UNIDAD, SUCURSAL Y SEGMENTO DE CLIENTE
    let WALLETS_FILTER = WALLETS.filter((wallet: any) => wallet.unit && wallet.sucursale && wallet.client_segment);

    let PRICE_S = WALLETS_FILTER.find((wallet: any) => wallet.unit.id == UNIT_SELECTED &&
      wallet.sucursale.id == this.sucursale_asesor &&
      wallet.client_segment.id == this.CLIENT_SELECTED.client_segment.id);

    //si existe una cincidencia se le acisga a l campo price el valor
    if (PRICE_S) {
      this.price = PRICE_S.precio;
      return;
    }


    //2.-BUSQUEDA POR UNIDAD y SUCURSAL O SEGMENTO DE CLIENTE
    //considerando que segmento de cliente no tiene asigando precio

    WALLETS_FILTER = WALLETS.filter((wallet: any) => wallet.unit && wallet.sucursale && !wallet.client_segment);

    let PRICE_SBA = WALLETS.find((wallet: any) => wallet.unit.id == UNIT_SELECTED &&
      wallet.sucursale.id == this.sucursale_asesor &&
      wallet.client_segment == null); //cundo en segmento de cliente no tiene asigando precio

    //considerando que no tiene asignado una sucursal
    WALLETS_FILTER = WALLETS.filter((wallet: any) => wallet.unit && !wallet.sucursale && wallet.client_segment);
    let PRICE_SBB = WALLETS.find((wallet: any) => wallet.unit.id == UNIT_SELECTED &&
      wallet.sucursale == null && //cundo en sucursal no tiene asigando precio
      wallet.client_segment.id == this.CLIENT_SELECTED.client_segment.id);

    if (PRICE_SBA && PRICE_SBB) {

      if (PRICE_SBA.precio < PRICE_SBB.precio) {
        this.price = PRICE_SBA.price_general;
      } else {
        this.price = PRICE_SBB.precio;
      }
      return;
    }


    if (PRICE_SBA) {
      this.price = PRICE_SBA.precio;
      return;
    }

    if (PRICE_SBB) {
      this.price = PRICE_SBB.precio;
      return;
    }



    //3.-BUSQUEDA POR UNIDAD 
    let PRICE_ST = WALLETS.find((wallet: any) => wallet.unit.id == UNIT_SELECTED &&
      wallet.sucursale == null &&
      wallet.client_segment == null);

    if (PRICE_ST) {
      this.price = PRICE_SBB.precio;
      return;
    }

    // EN CASO QUE NO HAYA PRECIO EN EL 1-2-3 ASIGNOS EL PRECIO GENERAL POR DEFECTO
    this.price = this.PRODUCT_SELECTED.price_general;
  }


  verifiedDiscount() {
    //para descuento maximo
    let DISCOUNT_MAX_REAL = (this.PRODUCT_SELECTED.max_descuento * 0.01) * this.price; //0.01 para convertir a porcentaje
    if (this.amount_discount > DISCOUNT_MAX_REAL) {
      this.toast.error("VALIDACIÖN", "El descuento no debe SUPERAR (" + DISCOUNT_MAX_REAL + ") que es lo configurado para este producto")
      this.amount_discount = 0;
    }
    //para descuento minimo
    let DISCOUNT_MIN_REAL = (this.PRODUCT_SELECTED.min_descuento * 0.01) * this.price; //0.01 para convertir a porcentaje
    if (this.amount_discount < DISCOUNT_MIN_REAL) {
      this.toast.error("VALIDACIÖN", "El descuento no debe ser menor a (" + DISCOUNT_MIN_REAL + ") que es lo configurado para este producto")
      this.amount_discount = 0;
    }

    console.log(this.amount_discount);
  }

  edit() {
    let SUBTOTAL = this.price - this.amount_discount;
    let IMPUESTO = SUBTOTAL * (this.PRODUCT_SELECTED.importe_iva * 0.01);
    let UNIDAD = this.PRODUCT_SELECTED.units.find((item: any) => item.id == this.unidad_product);

    this.DETAIL_PRODUCT.unidad=UNIDAD;
    this.DETAIL_PRODUCT.unidad_product=this.unidad_product;
    this.DETAIL_PRODUCT.descripcion=this.description_product;
    this.DETAIL_PRODUCT.cantidad=this.cantidad;
    this.DETAIL_PRODUCT.descuento=this.amount_discount;
    this.DETAIL_PRODUCT.impuesto=IMPUESTO;
    this.DETAIL_PRODUCT.subtotal=SUBTOTAL;
    this.DETAIL_PRODUCT.total=((SUBTOTAL + IMPUESTO) * this.cantidad);

 this.EditProductProforma.emit(this.DETAIL_PRODUCT);
 this.modal.close();
  }
}
