import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductsService } from '../service/products.service';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.scss']
})
export class CreateProductComponent {

  is_descount: number = 1;
  tab_selected: number = 1; ///para que se quede selccionado los tab general o inventario

  title: string = '';
  imagen_product: any;
  imagen_previsualiza: any = '/assets/media/svg/files/blank-image.svg';
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

  constructor(
    public toast: ToastrService,
    public productService: ProductsService,


  ) {

  }

  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
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

    this.WAREHOUSES_PRODUCT.push({
      unit: UNIT_SELECTED,
      warehouse: WAREHOUSE_SELECTED,
      quantity: this.cant_warehouse,
    });
    this.almacen_warehouse='';
    this.unit_warehouse='';
    this.cant_warehouse=0;
    console.log(this.WAREHOUSES_PRODUCT);
  }


  removeWarehouse(WAREHOUSES_PROD: any) {
    //el objeto que quiero eliminar
    //lista dednde se enuentra el objeto que quiero eliinar
    let INDEX_WAREHOUSE = this.WAREHOUSES_PRODUCT.findIndex((wh_prod: any) => (wh_prod.unit.id == WAREHOUSES_PROD.unit.id)
      && (wh_prod.warehouse.id == WAREHOUSES_PROD.warehouse.id));
    //eliminamos el objeto
    if (INDEX_WAREHOUSE != -1) {
      this.WAREHOUSES_PRODUCT.splice(INDEX_WAREHOUSE, 1);

    }

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
      this.toast.error("VALIDACION", "La existencia de ese producto con la sucursal, tipo de ciente y la unidad ya existe");
      return;
    }
    //agregando data
    this.WALLET_PRODUCTS.push({
      unit: UNIT_SELECTED,
      sucursale: SUCURSALE_SELECTED,
      client_segment: CLIENTSEGMENT_SELECTED,
      precio: this.precio_multiple,
      sucursale_precio_multiple: this.sucursale_precio_multiple, //caso que sucursale no sea obligatorio o campo en blanco
      segmentclient_precio_multiple: this.segmentclient_precio_multiple,//caso que tipo cliente no sea obligatorio o campo en blanco

    });
    this.unit_precio_multiple='';
    this.sucursale_precio_multiple='';
    this.segmentclient_precio_multiple='';
    this.precio_multiple=0;

    console.log(this.WALLET_PRODUCTS);
  }

  removeMultiple_precio(WALLET_PRODUCT: any) {
    //el objeto que quiero eliminar
    //lista dednde se enuentra el objeto que quiero eliinar
    let INDEX_PRECIO_MULTIPLE = this.WALLET_PRODUCTS.findIndex((wp_precio_prod: any) => (wp_precio_prod.unit.id == WALLET_PRODUCT.unit.id)
      && (wp_precio_prod.sucursale_precio_multiple == WALLET_PRODUCT.sucursale_precio_multiple)
      && (wp_precio_prod.segmentclient_precio_multiple == WALLET_PRODUCT.segmentclient_precio_multiple));
    //eliminamos el objeto
    if (INDEX_PRECIO_MULTIPLE != -1) {
      this.WALLET_PRODUCTS.splice(INDEX_PRECIO_MULTIPLE, 1);

    }

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
    console.log(this.product_categorie_id);
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

    if (this.WAREHOUSES_PRODUCT.length == 0) {
      this.toast.error("VALIDACIO", "Necesitas ingresar al menos un registro de existencias de producto al almacen");
      return;
    }

    if (this.WALLET_PRODUCTS.length == 0) {
      this.toast.error("VALIDACIO", "Necesitas ingresar al menos un listdo de precio al  producto ");
      return;
    }



    let formData = new FormData();
    formData.append("title", this.title);
    formData.append("description", this.description);
    formData.append("state", this.state);
    formData.append("product_categorie_id", this.product_categorie_id);
    formData.append("product_imagen", this.imagen_product);
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



    formData.append("WAREHOUSES_PRODUCT", JSON.stringify(this.WAREHOUSES_PRODUCT));
    formData.append("WALLET_PRODUCTS", JSON.stringify(this.WALLET_PRODUCTS));

    this.productService.registerProduct(formData).subscribe((resp: any) => {
      console.log(resp);

      if (resp.message == 200) {
        this.toast.success("FELICITACIONES", "El producto se registró con éxito");
        this.limpiarForm();
      } else {
        this.toast.warning("VALIDACIÓN", resp.message_text);
      }

    })

  }

  limpiarForm() {
    this.title = '';
    this.description = '';
    this.state = '1';
    this.product_categorie_id = '';
    this.imagen_product = null;
    this.price_general = 0;
    this.disponibilidad = '1';
    this.tiempo_de_abastecimiento = 0;
    this.is_descount = 1;
    this.min_descuento = 0;
    this.max_descuento = 0;
    this.tax_selected = '1';
    this.importe_iva = 0;
    this.sku = '';
    this.is_gratuito = 1;
    this.barcode = '',
    this.umbral = 0;
    this.umbral_unit_id = '';
    this.peso = 0;
    this.ancho = 0;
    this.alto = 0;
    this.largo = 0;
    this.WAREHOUSES_PRODUCT = [];
    this.WALLET_PRODUCTS = [];
    this.imagen_previsualiza= '/assets/media/svg/files/blank-image.svg';
  }




}
