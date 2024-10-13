import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-datatable-generic',
  templateUrl: './datatable-generic.component.html',
  styleUrls: ['./datatable-generic.component.scss']
})
export class DatatableGenericComponent implements OnInit, AfterViewInit {

  @ViewChild(DataTableDirective, { static: false })
  dtElement!: DataTableDirective;  // Referință către DataTableDirective

  dtOptions: any = {};  // Opțiuni pentru DataTables
  dtTrigger: Subject<any> = new Subject();  // Trigger pentru DataTables

  // Formularul reactiv pentru căutare
  searchForm: FormGroup;

  constructor(private http: HttpClient) {
    // Inițializează formularul reactiv
    this.searchForm = new FormGroup({
      firstNameSearch: new FormControl('')  // Control pentru căutare după First Name
    });
  }

  ngOnInit(): void {

    // Configurează DataTables
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,  // Numărul implicit de rânduri pe pagină
      lengthMenu: [ [5, 10, 25, 50, -1], [5, 10, 25, 50, "All"] ],  // Permite selectarea a câte rânduri să fie afișate
      serverSide: true,  // Activează paginarea pe server
      processing: true,  // Afișează indicatorul de procesare
      ajax: (dataTablesParameters: any, callback: any) => {
        const page = Math.ceil(dataTablesParameters.start / dataTablesParameters.length) + 1;
        let url = `https://reqres.in/api/users?page=${page}&per_page=${dataTablesParameters.length}`;

        const firstNameSearchValue = this.searchForm.get('firstNameSearch')?.value;
        if (firstNameSearchValue) {
          url += `&first_name=${firstNameSearchValue}`;
        }

        this.http.get(url).subscribe((resp: any) => {
          callback({
            recordsTotal: resp.total,
            recordsFiltered: resp.total,
            data: resp.data
          });
        });
      },
      columns: [
        { title: 'ID', data: 'id' },
        { title: 'First Name', data: 'first_name' },
        { title: 'Last Name', data: 'last_name' },
        { title: 'Email', data: 'email' },
        {
          title: 'Avatar', data: 'avatar',
          render: function(data: any) {
            return `<img src="${data}" width="50" height="50"/>`;
          }
        }
      ]
    };

    // Ascultă modificările din câmpul de căutare și declanșează reîncărcarea tabelei
    this.searchForm.get('firstNameSearch')?.valueChanges.pipe(
      debounceTime(300)  // Așteaptă 300ms după fiecare schimbare
    ).subscribe(() => {
      console.log("Căutare declanșată");
      this.rerender();  // Reîncarcă DataTables folosind metoda `rerender`
    });
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next(true);  // Inițializează DataTables la început
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();  // Dezabonare pentru a preveni scurgerile de memorie
  }

  // Funcție care reîncarcă complet tabelul folosind `ajax.reload()`
  rerender(): void {
    this.dtElement.dtInstance.then((dtInstance: any) => {
      dtInstance.ajax.reload();  // Reîncarcă tabelul DataTables
    });
  }
}
