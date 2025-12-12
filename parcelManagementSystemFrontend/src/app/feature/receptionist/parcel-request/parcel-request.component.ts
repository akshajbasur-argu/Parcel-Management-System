// src/app/your/path/parcel-request.component.ts
import { Component } from '@angular/core';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-parcel-request',
  standalone: false,
  templateUrl: './parcel-request.component.html',
  styleUrl: './parcel-request.component.css',
})
export class ParcelRequestComponent {
  constructor(private service: ReceptionistApiService) { }

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

 // parcel-request.component.ts (onSubmit)
onSubmit(form: any) {
  if (!form.valid) return;

  const payload = {
    description: String(form.value.description ?? ''),
    shortcode: String(form.value.shortcode ?? ''),
    recipientId: Number(form.value.username) || 0,
    name: String(form.value.name ?? '')
  };

  console.log('Submitting JSON payload:', payload);

  this.service.submitForm(payload).pipe(first()).subscribe((res: any) => {
    if (res && res.offline) {
      alert('You are offline. Parcel request queued and will be sent when back online.');
    } else if (res) {
      alert('New Parcel Created Successfully');
    } else {
      alert('Some error occured');
    }
    form.resetForm();
  }, (err) => {
    console.error('submitForm error', err);
    alert('Submit failed');
    form.resetForm();
  });
}

}

type Users = { id: number; name: String };
