import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProductCategorieService } from '../service/product-categorie.service';
import { CreateProductCategorieComponent } from '../create-product-categorie/create-product-categorie.component';
import { EditProductCategorieComponent } from '../edit-product-categorie/edit-product-categorie.component';
import { DeleteProductCategorieComponent } from '../delete-product-categorie/delete-product-categorie.component';

@Component({
  selector: 'app-list-product-categorie',
  templateUrl: './list-product-categorie.component.html',
  styleUrls: ['./list-product-categorie.component.scss']
})
export class ListProductCategorieComponent {

  search: string = '';
  CATEGORIAS: any = [];
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public productCategorieService: ProductCategorieService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.productCategorieService.isLoading$;
    this.listCategorieProducts()
  }

  listCategorieProducts(page = 1) {
    this.productCategorieService.listCategorieProducts(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.CATEGORIAS = resp.product_categories;// product_categories-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event: any) {
    this.listCategorieProducts($event)
  }

  createCategorieProduct() {
    const modalRef = this.modalService.open(CreateProductCategorieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.CategoriaCreate.subscribe((product_categories: any) => {
      this.CATEGORIAS.unshift(product_categories);
    })
  } 


   editCategorieProduct(CATEGORIA: any) {

    const modalRef = this.modalService.open(EditProductCategorieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.CATEGORIA_SELECTED = CATEGORIA;
    modalRef.componentInstance.CategoriaEdit.subscribe((product_categories: any) => {
      let INDEX = this.CATEGORIAS.findIndex((product_categories: any) => product_categories.id == CATEGORIA.id);
      if (INDEX != -1) {
        this.CATEGORIAS[INDEX] = product_categories;
      } 
    })
  }  

 deleteCategorieProduct(CATEGORIA: any) {

    const modalRef = this.modalService.open(DeleteProductCategorieComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.CATEGORIA_SELECTED = CATEGORIA;

    modalRef.componentInstance.CategoriaDelete.subscribe((product_categorie: any) => {
      let INDEX = this.CATEGORIAS.findIndex((product_categorie: any) => product_categorie.id == CATEGORIA.id);
      if (INDEX != -1) {
        this.CATEGORIAS.splice(INDEX,1);
      } 
    })
  }  

}
