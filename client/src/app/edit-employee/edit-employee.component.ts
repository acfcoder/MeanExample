import { Component, OnInit, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EmployeeFormComponent } from '../employee-form/employee-form.component';
import { MatCardModule } from '@angular/material/card';
import { Employee } from '../employee';
import { EmployeeService } from '../employee.service';

@Component({
  selector: 'app-edit-employee',
  standalone: true,
  imports: [EmployeeFormComponent, MatCardModule],
  template: `
     <mat-card>
      <mat-card-header>
        <mat-card-title>Edit an Employee</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <app-employee-form
          [initialState]="employee()"
          (formSubmitted)="editEmployee($event)"
        ></app-employee-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: ``
})
export class EditEmployeeComponent implements OnInit {
  employee = {} as WritableSignal<Employee>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      alert('no id provided');
    }
  
    this.employeeService.getEmployee(id!);
    this.employee = this.employeeService.employee$;
  
  }

  editEmployee(employee: Employee) {
    this.employeeService
      .updateEmployee(this.employee()._id || '', employee)
      .subscribe({
        next: () => {
          this.router.navigate(['']);
        },
        error: (error) => {
          alert('Failed to update employee');
          console.error (error);
        },
      });
  }
}
