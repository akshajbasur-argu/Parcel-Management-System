import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { SelectNamesDialog } from '../select-names-dialog/select-names-dialog';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { ReceptionistApiService } from '../../../core/service/receptionist-api.service';
@Component({
  selector: 'app-camera-upload',
  standalone: true,
  templateUrl: './camera-upload.html',
  styleUrl: './camera-upload.css',
  imports: [MatIcon],

})
export class CameraUpload {


  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  barcodeString: string = ''


  names: Array<Names> = [];

  constructor(private http: HttpClient, private dialog: MatDialog, private location: Location, private cookieService: CookieService,
    private router: Router,
  private receptionistApi: ReceptionistApiService,

  ) { }

  // Triggered when user selects or captures photo

  getRole(): string {
    const token = this.cookieService.get('accessToken');
    if(!token){
      this.router.navigate(['login']);
    }
    const decoded = jwtDecode<jwtPayload>(token);
    return decoded.role;
  }



  onCameraCapture(event: any) {
    console.log("on camera capture clicked")
    const file: File | null = event.target.files[0] ?? null;
    if (!file) return;

    this.selectedFile = file;

    this.previewUrl = URL.createObjectURL(file);
    console.log(this.previewUrl)
  }

  upload() {
  if (!this.selectedFile) {
    alert("Please capture an image first");
    return;
  }

  const formData = new FormData();
  formData.append("file", this.selectedFile, this.selectedFile.name);

  if (this.getRole() == "RECEPTIONIST") {
    this.receptionistApi.postInvoiceExtract(formData).subscribe({
      next: (res: any) => {
        // If offline queued, res will be { offline: true }
        if (res && (res as any).offline) {
          alert('You are offline — upload queued and will be processed when back online');
          return;
        }
        // online path => full response with names + barcodeString
        this.names = res.names ?? [];
        this.barcodeString = res.barcodeString ?? '';
        if (this.names.length > 1) {
          const dialogRef = this.dialog.open(SelectNamesDialog, {
            width: '400px',
            data: this.names
          });

          dialogRef.afterClosed().subscribe((selectedNames: OnlyNames[] | undefined) => {
            if (selectedNames) {
              const namesOnly = selectedNames.map(u => u.name);
              const barcodeString = this.barcodeString;
              this.receptionistApi.postInvoiceSendMail(namesOnly, barcodeString).subscribe({
                next: (r) => console.log('sendMail success', r),
                error: (err) => console.log('sendMail error', err)
              });
            }
          });
        }
        alert("Upload success");
      },
      error: (err) => {
        console.error('postInvoiceExtract error', err);
        alert("Upload failed:" + err);
      }
    });
  }

  if (this.getRole() == "EMPLOYEE") {
    this.receptionistApi.postInvoiceExtractEmployee(formData).subscribe({
      next: (res: any) => {
        if (res && res.offline) {
          alert('You are offline — extract queued');
          return;
        }
        if (res === true) alert("Parcel picked up successfully");
        else alert("Could not read the barcode on the parcel, try a new image");
      },
      error: (err) => {
        console.error(err);
        alert('Upload failed: ' + err);
      }
    });
  }
}
  backButton() {

    this.location.back();
  }

}

interface NamesResponse {
  names: Names[],
  barcodeString: string

}
interface Names {
  name: string,
  score: number

}
interface OnlyNames {
  name: string
}

interface jwtPayload {
  role: string;
  sub: string;
}




