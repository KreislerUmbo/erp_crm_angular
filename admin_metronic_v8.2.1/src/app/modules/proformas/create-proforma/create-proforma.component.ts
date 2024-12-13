import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CreateClientsPersonComponent } from '../../clients/create-clients-person/create-clients-person.component';
import { CreateClientsCompanyComponent } from '../../clients/create-clients-company/create-clients-company.component';
import { ProformasService } from '../service/proformas.service';
import { SearchClientsComponent } from '../components/search-clients/search-clients.component';
import { ToastrService } from 'ngx-toastr';
import { SearchProductsComponent } from '../components/search-products/search-products.component';
import { debounceTime, fromEvent } from 'rxjs';
import { EditProductDetailProformaComponent } from '../components/edit-product-detail-proforma/edit-product-detail-proforma.component';
import { DeleteProductDetailProformaComponent } from '../components/delete-product-detail-proforma/delete-product-detail-proforma.component';

@Component({
  selector: 'app-create-proforma',
  templateUrl: './create-proforma.component.html',
  styleUrls: ['./create-proforma.component.scss']
})
export class CreateProformaComponent {

  CLIENT_SELECTED: any;


  nro_document: string = '';
  full_name: string = '';
  phone: string = '';


  /** para la bsqueda de producto */
  search_product: string = '';// estoe es para buscar products
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
  importe_iva: number = 0;

  //detalle asignado del producto
  price_product: number = 0;
  DETAIL_PROFORMAS: any = [];


  REGIONES: any = [];
  PROVINCIA_SELECTEDS: any = [];
  DISTRITO_SELECTEDS: any = [];

  ubigeo_region: string = '';
  ubigeo_provincia: string = '';
  ubigeo_distrito: string = '';
  agencia: string = '';

  full_name_encargado: string = '';
  documento_encargado: string = '';
  telefono_encargado: string = '';

  deuda: number = 0;

  isLoading$: any;
  client_segments: any = [];
  asesores: any = [];
  user: any;
  sucursale_asesor: string = '';//esta variable es para calcular la sucursal donde esta le usuario 
  tipo_document_idents: any = [];


  TOTAL_PROFORMA: number = 0;
  TOTAL_IMPUESTO_PROFORMA: number = 0;
  DEUDA_PROFORMA: number = 0;
  PAID_OUT_PROFORMA: number = 0;
  source: any;//esto es para poder manipular los tiempos de keyup en los descuentos
  @ViewChild("discount") something: ElementRef;

  constructor(
    public modalSevice: NgbModal,
    public proformaService: ProformasService,
    public toast: ToastrService,
  ) {

  }

  ngOnInit() {
    this.isLoading$ = this.proformaService.isLoading$;
    this.user = this.proformaService.authservice.user;
    this.sucursale_asesor = this.user.sucursale_id;
    this.proformaService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.client_segments = resp.client_segments; //recuerde que resp.client_segments viene del configAll() del archivo proforma.servie.ts
      this.asesores = resp.asesores;
      this.tipo_document_idents = resp.tipo_document_idents;
    })
  }


  ngAfterViewInit(): void {
    this.source = fromEvent(this.something.nativeElement, 'keyup');
    this.source.pipe(debounceTime(1200)).subscribe((c: any) => {
      this.verifiedDiscount();
      this.isLoadingProccess();
    }
    );
  }

  isLoadingProccess() {
    this.proformaService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.proformaService.isLoadingSubject.next(false);

    }, 50);

  }


  changeUnitProduct($event: any) {
    console.log($event.target.value);

    if (!this.CLIENT_SELECTED) {
      this.loadUnidad = true;
      this.unidad_product = '';

      setTimeout(() => {
        this.loadUnidad = false;
      }, 50);

      this.toast.error("Validación", "Es necesario seleccionar a un cliente")
      this.isLoadingProccess();
    }

    let UNIT_SELECTED = $event.target.value
    /** sacamos los cantidades de unidade, o cajas aignadas a los almecenes  */
    this.warehouses_product = this.PRODUCT_SELECTED.warehouses.filter((wareh: any) => wareh.unit.id == UNIT_SELECTED);
    //validamos que las unidadedes y el almcen esten con el ususario asignado en esa sucursal, sino va aparecer de otras alcenenes que no tienen nada que ver con el ususario del formuarro
    this.exist_warehouse = this.warehouses_product.filter((wareh: any) => wareh.warehouse.id == this.sucursale_asesor);

    //filtro de precio multiple 
    let WALLETS = this.PRODUCT_SELECTED.wallets;

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

    this.verifiedDiscount();//al momento del modal de edicion actulize el descuento con los nuevos descuentos

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

  addProduct() {
    if (!this.PRODUCT_SELECTED) {
      this.toast.error("Validación", "No hay seleccionado un producto");
      return;
    }

    if (this.price == 0) {
      this.toast.error("Validación", "No hay seleccionado un producto");
      return;
    }

    if (this.cantidad == 0) {
      this.toast.error("Validación", "No hay seleccionado un producto");
      return;
    }
    if (!this.unidad_product) {
      this.toast.error("Validación", "No hay unidad del producto");
      return;

    }


    if (this.PRODUCT_SELECTED && this.PRODUCT_SELECTED.disponibilidad == 2) {
      if ((this.unidad_product && this.warehouses_product.length == 0) ||
        (this.unidad_product && this.warehouses_product.length > 0 && this.exist_warehouse.length == 0)) {
        this.toast.error("Validación", "El producto no se pude agregar debido a que no hay existencias disponibles");
        return;
      }
    }

    let SUBTOTAL = this.price - this.amount_discount;
    let IMPUESTO = SUBTOTAL * (this.PRODUCT_SELECTED.importe_iva * 0.01);
    let UNIDAD = this.PRODUCT_SELECTED.units.find((item: any) => item.id == this.unidad_product);

    this.DETAIL_PROFORMAS.push({
      product: this.PRODUCT_SELECTED,
      descripcion: this.description_product,
      unidad_product: this.unidad_product,
      unit: UNIDAD,
      cantidad: this.cantidad,
      descuento: this.amount_discount,
      price_unit: this.price,
      subtotal: SUBTOTAL,
      impuesto: IMPUESTO,
      total: ((SUBTOTAL + IMPUESTO) * this.cantidad),
    })
    this.resetProduct();
    this.sumTotalDetail();
  }

  resetProduct() {
    this.PRODUCT_SELECTED = null;
    this.search_product = '';
    this.price = 0;
    this.cantidad = 0;
    this.warehouses_product = [];
    this.amount_discount = 0;
    this.description_product = '';
    this.unidad_product = '';
    this.almacen_product = '';

  }

  sumTotalDetail() {
    this.TOTAL_PROFORMA = this.DETAIL_PROFORMAS.reduce((sum: number, current: any) => sum + current.total, 0);
    this.TOTAL_IMPUESTO_PROFORMA = this.DETAIL_PROFORMAS.reduce((sum: number, current: any) => sum + current.impuesto, 0);
    this.DEUDA_PROFORMA=this.TOTAL_PROFORMA;
    this.isLoadingProccess();
  }

  editProduct(DETAIL_PROFOR: any, INDEX: number) {
    const modalRef = this.modalSevice.open(EditProductDetailProformaComponent, { size: 'md', centered: true });
    modalRef.componentInstance.DETAIL_PRODUCT = DETAIL_PROFOR;
    modalRef.componentInstance.sucursale_asesor = this.sucursale_asesor;
    modalRef.componentInstance.CLIENT_SELECTED = this.CLIENT_SELECTED;

    modalRef.componentInstance.EditProductProforma.subscribe((product_edit: any) => {
      this.DETAIL_PROFORMAS[INDEX] = product_edit;
      this.isLoadingProccess();
      this.sumTotalDetail();
    })

  }

  deleteProduct(DETAIL_PROFOR: any, INDEX: number) {
    const modalRef = this.modalSevice.open(DeleteProductDetailProformaComponent, { size: 'md', centered: true });
    modalRef.componentInstance.DETAIL_PRODUCT = DETAIL_PROFOR;
    modalRef.componentInstance.DeleteProductProforma.subscribe((product_edit: any) => {
      this.DETAIL_PROFORMAS.splice(INDEX, 1);
      this.isLoadingProccess();
      this.sumTotalDetail();
    })

  }

  changeRegion($event: any) {

  }
  changeProvincia($event: any) {

  }

  searchClients() {

    if (!this.nro_document && !this.full_name && !this.phone) {
      this.toast.error("Validación", "Necesitas ingresar al menos uno de los campos");
      return;
    }

    this.proformaService.searchClients(this.nro_document, this.full_name, this.phone).subscribe((resp: any) => {
      console.log(resp);

      if (resp.clients.length > 1) {//si hay mas de 1 cliente 
        this.openSelectedClients(resp.clients);
      } else {
        if (resp.clients.length == 1) {  //si hay 1 cliente
          this.CLIENT_SELECTED = resp.clients[0];
          this.isLoadingProccess()
          this.nro_document = this.CLIENT_SELECTED.nro_document;
          this.full_name = this.CLIENT_SELECTED.full_name;
          this.phone = this.CLIENT_SELECTED.phone;
          this.toast.success("Exito", "se seleccionó al cliente de la proforma");
        } else {//si no hay cientes
          this.toast.error("Validacion", "NO hay coincidencia en la busqueda");
        }
      }

    });

  }

  searchProducts() {
    if (!this.search_product) {
      this.toast.error("Validación", "Necesitas ingresar un nombre de producto para buscar");
      return;
    }

    this.proformaService.searchProducts(this.search_product).subscribe((resp: any) => {
      console.log(resp);

      if (resp.products.data.length > 1) {//si hay mas de 1 product, el product.data se coloca porque viene de un collection
        this.openSelectedProducts(resp.products.data);
      } else {
        if (resp.products.data.length == 1) {  //si hay 1 product
          this.PRODUCT_SELECTED = resp.products.data[0];
          this.isLoadingProccess()
          this.search_product = this.PRODUCT_SELECTED.title;
          this.toast.success("Exito", "se seleccionó al cliente de la proforma");
        } else {//si no hay cientes
          this.toast.error("Validacion", "NO hay coincidencia en la busqueda");
        }
      }

    });
  }

  openSelectedClients(clients: any = []) {
    const modalRef = this.modalSevice.open(SearchClientsComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.clients = clients

    modalRef.componentInstance.ClientSelected.subscribe((client: any) => {  // ClientSelected esto viene del componente hijo del output search-clients.components.ts
      this.CLIENT_SELECTED = client;
      this.isLoadingProccess();
      this.nro_document = this.CLIENT_SELECTED.nro_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;
      this.toast.success("Exito", "se seleccionó al cliente de la proforma");
    })

  }

  openSelectedProducts(products: any = []) {
    const modalRef = this.modalSevice.open(SearchProductsComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.products = products

    modalRef.componentInstance.ProductSelected.subscribe((product: any) => {  // ProductSelected esto viene del componente hijo del output search-products.components.ts
      this.PRODUCT_SELECTED = product;
      this.search_product = this.PRODUCT_SELECTED.title;//asigna le titulo al html en el campo search_product
      this.isLoadingProccess();
      this.toast.success("Exito", "se seleccionó el prducto para la proforma");
    })
  }

  createClientPerson() {
    const modalRef = this.modalSevice.open(CreateClientsPersonComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.tipo_document_idents = this.tipo_document_idents;
    //para hacer que se cree el registro traemos el CientPersonCreate del archivo create Create-ClientsPerson.Component.ts
    modalRef.componentInstance.CientPersonCreate.subscribe((client: any) => {
      this.CLIENT_SELECTED = client;
      this.nro_document = this.CLIENT_SELECTED.nro_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;
      this.isLoadingProccess();
    })
  }
  createClientCompany() {
    const modalRef = this.modalSevice.open(CreateClientsCompanyComponent, { size: 'lg', centered: true });
    modalRef.componentInstance.client_segments = this.client_segments;
    modalRef.componentInstance.asesores = this.asesores;
    modalRef.componentInstance.tipo_document_idents = this.tipo_document_idents;
    //para hacer que se cree el registro traemos el ClientCompanyCreate del archivo create Create-ClientsPerson.Component.ts por el output
    modalRef.componentInstance.ClientCompanyCreate.subscribe((client: any) => {
      this.CLIENT_SELECTED = client;
      this.nro_document = this.CLIENT_SELECTED.nro_document;
      this.full_name = this.CLIENT_SELECTED.full_name;
      this.phone = this.CLIENT_SELECTED.phone;
      this.isLoadingProccess();
    })
  }
  resetClient() {
    this.CLIENT_SELECTED = null;
    this.nro_document = '';
    this.full_name = '';
    this.phone = '';
    this.isLoadingProccess();
  }


}
