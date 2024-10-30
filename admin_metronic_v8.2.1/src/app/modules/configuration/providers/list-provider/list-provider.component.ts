import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProviderService } from '../service/provider.service';
import { CreateProviderComponent } from '../create-provider/create-provider.component';
import { EditProviderComponent } from '../edit-provider/edit-provider.component';
import { DeleteProviderComponent } from '../delete-provider/delete-provider.component';

@Component({
  selector: 'app-list-provider',
  templateUrl: './list-provider.component.html',
  styleUrls: ['./list-provider.component.scss']
})
export class ListProviderComponent {

  search: string = '';
  PROVEEDORES: any = [];
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public providerService: ProviderService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.providerService.isLoading$;
    this.listProviders()
  }

  listProviders(page = 1) {
    this.providerService.listProviders(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.PROVEEDORES = resp.providers;// product_categories-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event: any) {
    this.listProviders($event)
  }

  createProvider() {
    const modalRef = this.modalService.open(CreateProviderComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.ProviderCreate.subscribe((providers: any) => {
      this.PROVEEDORES.unshift(providers);
    })
  }


  editProvider(PROVEEDOR: any) {
      const modalRef = this.modalService.open(EditProviderComponent, { centered: true, size: 'md' });
        modalRef.componentInstance.PROVEEDOR_SELECTED = PROVEEDOR;
        modalRef.componentInstance.ProveedorEdit.subscribe((provider: any) => {
          let INDEX = this.PROVEEDORES.findIndex((provider: any) => provider.id == PROVEEDOR.id);
          if (INDEX != -1) {
            this.PROVEEDORES[INDEX] = provider;
          } 
        }) 
  }

  deleteProvider(PROVEEDOR: any) {
     
        const modalRef = this.modalService.open(DeleteProviderComponent, { centered: true, size: 'md' });
        modalRef.componentInstance.PROVEEDOR_SELECTED = PROVEEDOR;
    
        modalRef.componentInstance.ProveedorDelete.subscribe((provider: any) => {
          let INDEX = this.PROVEEDORES.findIndex((provider: any) => provider.id == PROVEEDOR.id);
          if (INDEX != -1) {
            this.PROVEEDORES.splice(INDEX,1);
          } 
        }) 
  }

}
