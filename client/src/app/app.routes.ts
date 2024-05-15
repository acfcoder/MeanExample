import { Routes } from '@angular/router';
import { EmployeesListComponent } from './employees-list/employees-list.component';
import { EmployeeFormComponent } from './employee-form/employee-form.component';

export const routes: Routes = [
    { path: '', component: EmployeesListComponent, title: 'Employees List' },
    { path: 'new', component: EmployeeFormComponent, title: 'Add a new employee'}
];
