import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WarehouseService } from '../service/warehouse.service';
import { CreateWarehouseComponent } from '../create-warehouse/create-warehouse.component';
import { EditWarehouseComponent } from '../edit-warehouse/edit-warehouse.component';
import { DeleteWarehouseComponent } from '../delete-warehouse/delete-warehouse.component';

@Component({
  selector: 'app-list-warehouse',
  templateUrl: './list-warehouse.component.html',
  styleUrls: ['./list-warehouse.component.scss']
})
export class ListWarehouseComponent {
  search: string = '';
  WAREHOUSES: any = [];
  SUCURSALES:any = [];
  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public warehouseService: WarehouseService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.warehouseService.isLoading$;
    this.listWarehouses()
  }

  listWarehouses(page = 1) {
    this.warehouseService.listWarehouses(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.WAREHOUSES = resp.warehouses;// sucursales-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
      this.SUCURSALES=resp.sucursales;
    })
  }

  loadPage($event: any) {
    this.listWarehouses($event)
  }

  createWarehouse() {
    const modalRef = this.modalService.open(CreateWarehouseComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.SUCURSALES=this.SUCURSALES;
    modalRef.componentInstance.WarehouseC.subscribe((warehouse: any) => {
      this.WAREHOUSES.unshift(warehouse);
    })
  }

  editWarehouse(WAREHOUSE: any) {
    const modalRef = this.modalService.open(EditWarehouseComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;
    modalRef.componentInstance.SUCURSALES=this.SUCURSALES;//PARA LISTAS DE SUCURSALES

    modalRef.componentInstance.WarehouseE.subscribe((warehouse: any) => {
      let INDEX = this.WAREHOUSES.findIndex((warehouse: any) => warehouse.id == WAREHOUSE.id);
      if (INDEX != -1) {
        this.WAREHOUSES[INDEX] = warehouse;
      } 
    })
  }

  deleteSucursal(WAREHOUSE: any) {

    const modalRef = this.modalService.open(DeleteWarehouseComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.WAREHOUSE_SELECTED = WAREHOUSE;

    modalRef.componentInstance.WarehouseD.subscribe((warehouse: any) => {
      let INDEX = this.WAREHOUSES.findIndex((warehouse: any) => WAREHOUSE.id == WAREHOUSE.id);
      if (INDEX != -1) {
        this.WAREHOUSES.splice(INDEX,1);
      } 
    })
  }


}
