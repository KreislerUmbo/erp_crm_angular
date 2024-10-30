import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UnitService } from '../service/unit.service';
import { CreateUnitComponent } from '../create-unit/create-unit.component';
import { EditUnitComponent } from '../edit-unit/edit-unit.component';
import { DeleteUnitComponent } from '../delete-unit/delete-unit.component';
import { CreateTransformsUnitComponent } from '../create-transforms-unit/create-transforms-unit.component';

@Component({
  selector: 'app-list-unit',
  templateUrl: './list-unit.component.html',
  styleUrls: ['./list-unit.component.scss']
})
export class ListUnitComponent {

  search: string = '';
  UNIDADES: any = [];

  isLoading$: any;
  totalPages: number = 0;
  currentPage: number = 1;

  constructor(
    public modalService: NgbModal,
    public unitService: UnitService,
  ) {

  }
  ngOnInit(): void {
    this.isLoading$ = this.unitService.isLoading$;
    this.listUnits()
  }

  listUnits(page = 1) {
    this.unitService.listUnits(page, this.search).subscribe((resp: any) => {
      console.log(resp);
      this.UNIDADES = resp.units;// units-> es el nombbre debe ser igual al que se puso en index de laravel
      this.totalPages = resp.total;
      this.currentPage = page;
    })
  }

  loadPage($event: any) {
    this.listUnits($event)
  }

  createUnit() {
    const modalRef = this.modalService.open(CreateUnitComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.UnitCreate.subscribe((unit: any) => {
      this.UNIDADES.unshift(unit);
    })
  }

  editUnit(UNIDAD: any) {

    const modalRef = this.modalService.open(EditUnitComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.UNIDAD_SELECTED = UNIDAD;
    modalRef.componentInstance.UnidadEdit.subscribe((unit: any) => {
      let INDEX = this.UNIDADES.findIndex((unit: any) => unit.id == UNIDAD.id);
      if (INDEX != -1) {
        this.UNIDADES[INDEX] = unit;
      }
    })
  }

  deleteUnit(UNIDAD: any) {
    const modalRef = this.modalService.open(DeleteUnitComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.UNIDAD_SELECTED = UNIDAD;

    modalRef.componentInstance.UnidadDelete.subscribe((unit: any) => {
      let INDEX = this.UNIDADES.findIndex((unit: any) => unit.id == UNIDAD.id);
      if (INDEX != -1) {
        this.UNIDADES.splice(INDEX, 1);
      }
    })
  }

  addTransform(UNIDAD: any) {
    const modalRef = this.modalService.open(CreateTransformsUnitComponent, { centered: true, size: 'md' });
    modalRef.componentInstance.UNIDAD_SELECTED = UNIDAD;
    modalRef.componentInstance.UNITS = this.UNIDADES.filter((unit: any) => unit.id != UNIDAD.id);
  }

}
