import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';
import { ActivatedRoute } from '@angular/router';
import { ProductWarehousesService } from '../service/product-warehouses.service';
import { ProductWalletsService } from '../service/product-wallets.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EditWarehouseProductComponent } from '../warehouse/edit-warehouse-product/edit-warehouse-product.component';
import { EditWalletPriceProductComponent } from '../wallet/edit-wallet-price-product/edit-wallet-price-product.component';
import { DeleteWarehouseProductComponent } from '../warehouse/delete-warehouse-product/delete-warehouse-product.component';
import { DeleteWalletPriceProductComponent } from '../wallet/delete-wallet-price-product/delete-wallet-price-product.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent {

  is_descount: number = 1;
  tab_selected: number = 1; ///para que se quede selccionado los tab general o inventario

  title: string = '';
  imagen_product: any;
  imagen_previsualiza: any;
  description: string = '';
  price_general: number = 0;
  disponibilidad: string = '';
  tiempo_de_abastecimiento: number = 0;
  min_descuento: number = 0;
  max_descuento: number = 0;
  tax_selected: string = '1';
  importe_iva: number = 0;
  product_categorie_id: string = '';
  state: string = '1';
  sku: string = '';
  barcode: string = '';
  umbral_unit_id: string = '';
  umbral: number = 0;
  is_gratuito: number = 1;

  peso: number = 0;
  ancho: number = 0;
  alto: number = 0;
  largo: number = 0;

  isLoading$: any;

  //SECCION ALMACEN
  almacen_warehouse: string = '';
  unit_warehouse: string = '';
  cant_warehouse: number = 0;
  WAREHOUSES_PRODUCT: any = []; //almacena la lista de producto, dado un almace y unidad

  //SECCION PRECIO MULTIPLES
  unit_precio_multiple: string = '';
  sucursale_precio_multiple: string = '';
  segmentclient_precio_multiple: string = '';
  precio_multiple: number = 0;
  WALLET_PRODUCTS: any = [];



  //para recorre listado
  WAREHOUSES: any = [];
  SUCURSALES: any = [];
  UNITS: any = [];
  CLIENT_SEGMENTS: any = [];
  CATEGORIES: any = [];

  PRODUCT_ID: string = '';
  PRODUCT_SELECTED: any = null;

  constructor(
    public toast: ToastrService,
    public productService: ProductsService,
    public ActivedRoute: ActivatedRoute,
    public productWarehouseService: ProductWarehousesService,
    public productWalletsService: ProductWalletsService,
    public modalService: NgbModal,
  ) {

  }

  ngOnInit(): void {

    this.ActivedRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.PRODUCT_ID = resp.id;
    })
    this.isLoading$ = this.productService.isLoading$;
    this.productService.showProduct(this.PRODUCT_ID).subscribe((resp: any) => {
      console.log(resp);
      this.PRODUCT_SELECTED = resp.product;

      this.is_descount = this.PRODUCT_SELECTED.is_descount;
      this.title = this.PRODUCT_SELECTED.title;
      this.imagen_previsualiza = this.PRODUCT_SELECTED.imagen;//aqui imagen viende del controller
      this.description = this.PRODUCT_SELECTED.description;
      this.price_general = this.PRODUCT_SELECTED.price_general;
      this.disponibilidad = this.PRODUCT_SELECTED.disponibilidad;
      this.tiempo_de_abastecimiento = this.PRODUCT_SELECTED.tiempo_de_abastecimiento;
      this.min_descuento = this.PRODUCT_SELECTED.min_descuento;
      this.max_descuento = this.PRODUCT_SELECTED.max_descuento;
      this.tax_selected = this.PRODUCT_SELECTED.tax_selected;
      this.importe_iva = this.PRODUCT_SELECTED.importe_iva;
      this.product_categorie_id = this.PRODUCT_SELECTED.product_categorie_id;
      this.state = this.PRODUCT_SELECTED.state;
      this.sku = this.PRODUCT_SELECTED.sku;
      this.barcode = this.PRODUCT_SELECTED.barcode;
      this.umbral_unit_id = this.PRODUCT_SELECTED.umbral_unit_id;
      this.umbral = this.PRODUCT_SELECTED.umbral;
      this.is_gratuito = this.PRODUCT_SELECTED.is_gratuito;
      this.peso = this.PRODUCT_SELECTED.peso;
      this.ancho = this.PRODUCT_SELECTED.ancho;
      this.alto = this.PRODUCT_SELECTED.alto;
      this.largo = this.PRODUCT_SELECTED.largo;

      this.WAREHOUSES_PRODUCT = this.PRODUCT_SELECTED.warehouses;// warehouses viende l collecteion ProductResourse
      this.WALLET_PRODUCTS = this.PRODUCT_SELECTED.wallets;
    });

    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);

      this.WAREHOUSES = resp.almacenes;
      this.SUCURSALES = resp.sucursales;
      this.UNITS = resp.units;
      this.CLIENT_SEGMENTS = resp.segment_clients;
      this.CATEGORIES = resp.categories;
    })
  }

  addwarehouse() {
    if (!this.almacen_warehouse ||
      !this.unit_warehouse ||
      !this.cant_warehouse
    ) {
      this.toast.error("VALIDACION", "Necesitas seleccionar un almacen y una unidad, aparte de colocar una cantidad");
      return;
    }

    let UNIT_SELECTED = this.UNITS.find((unit: any) => unit.id == this.unit_warehouse);
    let WAREHOUSE_SELECTED = this.WAREHOUSES.find((almacen: any) => almacen.id == this.almacen_warehouse);
    //validamos que no se repitan las filas con los datos
    let INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod: any) =>
      (wh_prod.unit.id == this.unit_warehouse)
      && (wh_prod.warehouse.id == this.almacen_warehouse));

    if (INDEX_WAREHOUSE != -1) {
      this.toast.error("VALIDACION", "La existencia de ese prducto con el almacen y la unidad ya existe");
      return;
    }

    let data = {
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_warehouse,
      warehouse_id: this.almacen_warehouse,
      quantity: this.cant_warehouse
    }

    this.productWarehouseService.registerProductWarehouse(data).subscribe((resp: any) => {
      this.WAREHOUSES_PRODUCT.push(resp.product_warehouse);
      this.almacen_warehouse = ''
      this.unit_warehouse = ''
      this.cant_warehouse = 0
      this.toast.success("EXITO", "La existencia de ese prOducto se agregó correctamente");
      this.isLoadingProccess();
    })
    /*     unit: UNIT_SELECTED,
        warehouse: WAREHOUSE_SELECTED,
        quantity: this.cant_warehouse, */
    console.log(this.WAREHOUSES_PRODUCT);
  }


  editWarehouse(WAREHOUSES_PROD: any) {
    const modalRef = this.modalService.open(EditWarehouseProductComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.WAREHOUSES_PRODUCT = WAREHOUSES_PROD;
    modalRef.componentInstance.UNITS = this.UNITS;
    modalRef.componentInstance.WAREHOUSES = this.WAREHOUSES;
    modalRef.componentInstance.WarehouseEdit.subscribe((wh_product: any) => {
      let INDEX = this.WAREHOUSES_PRODUCT.findIndex((wh_prod: any) => wh_prod.id == WAREHOUSES_PROD.id);
      if (INDEX != -1) {
        this.WAREHOUSES_PRODUCT[INDEX] = wh_product;
      }
      this.isLoadingProccess();
    })
  }


  removeWarehouse(WAREHOUSES_PROD: any) {
    const modalRef = this.modalService.open(DeleteWarehouseProductComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.WAREHOUSES_PROD = WAREHOUSES_PROD;

    modalRef.componentInstance.WarehouseDelete.subscribe((wh_product: any) => {
      //el objeto que quiero eliminar
      //lista dednde se enuentra el objeto que quiero eliinar
      let INDEX = this.WAREHOUSES_PRODUCT.findIndex((wh_prod: any) => (wh_prod.id == WAREHOUSES_PROD.id));
      //eliminamos el objeto
      if (INDEX != -1) {
        this.WAREHOUSES_PRODUCT.splice(INDEX, 1);
      }
      this.isLoadingProccess();
    })

     //el objeto que quiero eliminar
/*       //lista dednde se enuentra el objeto que quiero eliinar
      let INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod: any) => (wh_prod.unit.id == WAREHOUSES_PROD.unit.id)
        && (wh_prod.warehouse.id == WAREHOUSES_PROD.warehouse.id));
      //eliminamos el objeto
      if (INDEX_WAREHOUSE != -1) {
        this.WAREHOUSES_PRODUCT.splice(INDEX_WAREHOUSE, 1);
      } */
  }


  addMultipleprecio() {
    if (!this.unit_precio_multiple ||
      !this.precio_multiple
    ) {
      this.toast.error("VALIDACION", "Necesitas seleccionar una unidad, aparte de colocar el precio");
      return;
    }
    let UNIT_SELECTED = this.UNITS.find((unit: any) => unit.id == this.unit_precio_multiple);
    let SUCURSALE_SELECTED = this.SUCURSALES.find((sucursal: any) => sucursal.id == this.sucursale_precio_multiple);
    let CLIENTSEGMENT_SELECTED = this.CLIENT_SEGMENTS.find((cliensegment: any) => cliensegment.id == this.segmentclient_precio_multiple);

    //validamos filas que no se repitan
    let INDEX_PRECIO_MULTIPLE = this.WALLET_PRODUCTS.findIndex((wp_precio_prod: any) =>
      (wp_precio_prod.unit.id == this.unit_precio_multiple) &&
      (wp_precio_prod.sucursale_precio_multiple == this.sucursale_precio_multiple) &&
      (wp_precio_prod.segmentclient_precio_multiple == this.segmentclient_precio_multiple)
    );
    if (INDEX_PRECIO_MULTIPLE != -1) {
      this.toast.error("VALIDACION", "La existencia de ese producto con la sucursal, tipo de cliente y la unidad ya existe");
      return;
    }


    //agregando data
    let data = {
      product_id: this.PRODUCT_ID,
      unit_id: this.unit_precio_multiple,
      client_segment_id: this.segmentclient_precio_multiple,
      sucursal_id: this.sucursale_precio_multiple,
      price_general: this.precio_multiple
    }
    this.productWalletsService.registerProductWallet(data).subscribe((resp: any) => {
      console.log(resp);
      this.WALLET_PRODUCTS.push(resp.product_wallet);
      this.unit_precio_multiple = '';
      this.sucursale_precio_multiple = '';
      this.segmentclient_precio_multiple = '';
      this.precio_multiple = 0;
      this.toast.success("EXITO", "El precio de ese producto se agregó correctamente");
      this.isLoadingProccess();
    })
    console.log(this.WALLET_PRODUCTS);
  }

  editProductWallet(WALLET_PRODUCT: any) {
    const modalRef = this.modalService.open(EditWalletPriceProductComponent, { centered: true, size: 'lg' });
    modalRef.componentInstance.WALLET_PRODUCT = WALLET_PRODUCT;
    modalRef.componentInstance.UNITS = this.UNITS;
    modalRef.componentInstance.SUCURSALES = this.SUCURSALES;
    modalRef.componentInstance.CLIENT_SEGMENTS = this.CLIENT_SEGMENTS;
    modalRef.componentInstance.WalletEdit.subscribe((wll_product: any) => {
      let INDEX = this.WALLET_PRODUCTS.findIndex((wll_prod: any) => wll_prod.id == WALLET_PRODUCT.id);

      if (INDEX != -1) {
        this.WALLET_PRODUCTS[INDEX] = wll_product;
      }
      this.isLoadingProccess();
    })
  }

  removeMultiple_precio(WALLET_PRODUCT: any) {

    const modalRef = this.modalService.open(DeleteWalletPriceProductComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.WALLET_PRODUCT = WALLET_PRODUCT;

    modalRef.componentInstance.WalletDelete.subscribe((wll_product: any) => {
      //el objeto que quiero eliminar
      //lista dednde se enuentra el objeto que quiero eliinar
      let INDEX = this.WALLET_PRODUCTS.findIndex((wll_prod: any) => (wll_prod.id == WALLET_PRODUCT.id));
      //eliminamos el objeto
      if (INDEX != -1) {
        this.WALLET_PRODUCTS.splice(INDEX, 1);
      }
      this.isLoadingProccess();
    })

 /*    //el objeto que quiero eliminar
    //lista donde se enuentra el objeto que quiero eliinar
    let INDEX_PRECIO_MULTIPLE = this.WALLET_PRODUCTS.findIndex((wp_precio_prod: any) => (wp_precio_prod.unit.id == WALLET_PRODUCT.unit.id)
      && (wp_precio_prod.sucursale_precio_multiple == WALLET_PRODUCT.sucursale_precio_multiple)
      && (wp_precio_prod.segmentclient_precio_multiple == WALLET_PRODUCT.segmentclient_precio_multiple));
    //eliminamos el objeto
    if (INDEX_PRECIO_MULTIPLE != -1) {
      this.WALLET_PRODUCTS.splice(INDEX_PRECIO_MULTIPLE, 1);

    } */

  }


  isLoadingProccess() {
    this.productService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.productService.isLoadingSubject.next(false);

    }, 50);

  }


  processFile($event: any) {
    if ($event.target.files[0].type.indexOf("image") < 0) {
      this.toast.warning("WARM", "El archivo no es una imagen");
      return false;
    }
    this.imagen_product = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.imagen_product);
    reader.onloadend = () => this.imagen_previsualiza = reader.result;
    this.isLoadingProccess();
  }

  isGratuito() {
    this.is_gratuito = this.is_gratuito == 1 ? 2 : 1;
    console.log(this.is_gratuito);
    //cuando es 1=no hay opcion que sea grtuito
    //  2= grtuito
  }

  selectedDiscount(val: number) {
    this.is_descount = val;
  }

  selectedTab(val: number) {
    this.tab_selected = val;
  }

  store() {
    console.log(this.imagen_product);
    if (!this.title) {
      this.toast.error("VALIDACIO", "El campo titulo es requerido");
      return;
    }
    if (!this.description) {
      this.toast.error("VALIDACIO", "El campo description es requerido");
      return;
    }
    if (!this.product_categorie_id) {
      this.toast.error("VALIDACIO", "El campo categoria es requerido");
      return;
    }

    if (!this.price_general) {
      this.toast.error("VALIDACIO", "El campo precio es requerido");
      return;
    }

    /*     if (this.WAREHOUSES_PRODUCT.length == 0) {
          this.toast.error("VALIDACIO", "Necesitas ingresar al menos un registro de existencias de producto al almacen");
          return;
        }
    
        if (this.WALLET_PRODUCTS.length == 0) {
          this.toast.error("VALIDACIO", "Necesitas ingresar al menos un listdo de precio al  producto ");
          return;
        } */



    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("description", this.description);
    formData.append("state", this.state);
    formData.append("product_categorie_id", this.product_categorie_id);

    if (this.imagen_product) {
      formData.append("product_imagen", this.imagen_product);
    }
    formData.append("price_general", this.price_general + "");
    formData.append("disponibilidad", this.disponibilidad);
    formData.append("tiempo_de_abastecimiento", this.tiempo_de_abastecimiento + "");
    formData.append("is_descount", this.is_descount + "");
    formData.append("min_descuento", this.min_descuento + "");
    formData.append("max_descuento", this.max_descuento + "");
    formData.append("tax_selected", this.tax_selected + "");
    formData.append("importe_iva", this.importe_iva + "");

    formData.append("sku", this.sku);
    formData.append("is_gratuito", this.is_gratuito + "");
    formData.append("barcode", this.barcode);
    formData.append("umbral", this.umbral + "");
    formData.append("umbral_unit_id", this.umbral_unit_id);

    formData.append("peso", this.peso + "");
    formData.append("ancho", this.ancho + "");
    formData.append("alto", this.alto + "");
    formData.append("largo", this.largo + "");



    /*     formData.append("WAREHOUSES_PRODUCT", JSON.stringify(this.WAREHOUSES_PRODUCT));
        formData.append("WALLET_PRODUCTS", JSON.stringify(this.WALLET_PRODUCTS)); */

    this.productService.updateProduct(this.PRODUCT_ID, formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 200) {
        this.toast.success("FELICITACIONES", "El producto se Edito con éxito");
      } else {
        this.toast.warning("VALIDACIÓN", resp.message_text);
      }

    })

  }

}
