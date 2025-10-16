import { Component, inject } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';

@Component({
  selector: 'app-parcel-request',
  standalone: false,
  templateUrl: './parcel-request.component.html',
  styleUrl: './parcel-request.component.css',
})
export class ParcelRequestComponent {
  constructor(private service: ReceptionistApiService) {}
  ngOnInit(): any {
    this.service.fetchUsers().subscribe((res) => {
      this.users = res;
    });
  }
  formData = {
    description: '',
    shortcode: '',
    recipientId: 0,
    name: '',
  };
  users: Array<Users> = [];
  onSubmit(form: any) {
    if (form.valid) {
      this.formData.recipientId = Number(form.value.username);
      this.service.submitForm(this.formData).subscribe((res) => {
        if (res) {
          alert('New Parcel Created Successfully');
        } else {
          alert('Some error occured');
        }
      });
    }
    form.resetForm();
  }
}
type Users = { id: number; name: String };
