import { Component } from '@angular/core';
import { ProductsService } from '../service/products.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteProductComponent } from '../delete-product/delete-product.component';

@Component({
  selector: 'app-list-product',
  templateUrl: './list-product.component.html',
  styleUrls: ['./list-product.component.scss']
})
export class ListProductComponent {

  element:boolean=false;
  search: string = '';
  PRODUCTS: any = [];
  CATEGORIES: any = [];
  SUCURSALES: any = [];
  WAREHOUSES: any = [];
  CLIENT_SEGMENTS: any = [];

  isLoading$: any;
  product_categorie_id: string = '';
  segmentclient_precio_multiple: string = '';
  almacen_warehouse: string = '';


  disponibilidad = '';
  tax_selected = '';

  sucursale_precio_multiple: string = '';

  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public productService: ProductsService
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.productService.isLoading$;
    this.listProducts();
    this.configAll();
  }

  mostrarBusqueda() {
    return (this.element = true);
  }
  ocultarBusqueda() {
    return (this.element = false);
  }

  listProducts(page = 1) {

    let data = {
      product_categorie_id: this.product_categorie_id,
      disponibilidad: this.disponibilidad,
      tax_selected: this.tax_selected,
      search: this.search,
      //FILTRO ESPECIAL
      sucursale_precio_multiple: this.sucursale_precio_multiple,
      almacen_warehouse: this.almacen_warehouse,
      segmentclient_precio_multiple:this.segmentclient_precio_multiple
    }

    this.productService.listProducts(page, data).subscribe((resp: any) => {
      console.log(resp);
      this.PRODUCTS = resp.products.data;//en resp.products.data el product viene de index controlador y se agrega data porque es un array que viene de collection
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  resetlistProducts() {
    this.product_categorie_id = '',
      this.disponibilidad = '',
      this.tax_selected = '',
      this.search = '',
      this.sucursale_precio_multiple= '',
      this.almacen_warehouse= '',
      this.segmentclient_precio_multiple= '',
      this.listProducts();
  }

  configAll() {
    this.productService.configAll().subscribe((resp: any) => {
      console.log(resp);
      this.CATEGORIES = resp.categories;
      this.SUCURSALES = resp.sucursales;
      this.WAREHOUSES = resp.almacenes;
      this.CLIENT_SEGMENTS = resp.segment_clients;
    })
  }


  getDisponibilidad(val: number) {
    let TEXTO = "";
    switch (val) {
      case 1:
        TEXTO = "Vender productos sin stock";
        break;

      case 2:
        TEXTO = "NO vender los prodcutos sin stock";
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


  loadPage($event: any) {
    this.listProducts($event)
  }









  deleteProduct(PRODUCT: any) {

    const modalRef = this.modalService.open(DeleteProductComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.PRODUCT_SELECTED = PRODUCT;

    modalRef.componentInstance.ProductDelete.subscribe((prod: any) => {
      let INDEX = this.PRODUCTS.findIndex((prod: any) => prod.id == PRODUCT.id);
      if (INDEX != -1) {
        this.PRODUCTS.splice(INDEX, 1);
      }

    })
  }



}
