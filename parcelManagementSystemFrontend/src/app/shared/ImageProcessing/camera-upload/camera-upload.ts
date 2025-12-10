import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { SelectNamesDialog } from '../select-names-dialog/select-names-dialog';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule, Location } from '@angular/common';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
@Component({
  selector: 'app-camera-upload',
  standalone: true,
  templateUrl: './camera-upload.html',
  styleUrl: './camera-upload.css',
  imports: [MatIcon, CommonModule],

})
export class CameraUpload {


  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  barcodeString: string = ''


  names: Array<Names> = [];

  constructor(private http: HttpClient, private dialog: MatDialog, private location: Location, private cookieService: CookieService,
    private router: Router,

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
    formData.append("file", this.selectedFile);

    console.log(formData)
    if (this.getRole() == "RECEPTIONIST") {
      this.http.post<NamesResponse>('http://localhost:8081/api/invoice/extract', formData, { withCredentials: true })
        .subscribe({
          next: (res) => {
            this.names = res.names;
            this.barcodeString = res.barcodeString
            console.log(this.names)
            if (this.names.length > 1) {
              const dialogRef = this.dialog.open(SelectNamesDialog, {
                width: '400px',
                data: this.names
              });

              dialogRef.afterClosed().subscribe((selectedNames: OnlyNames[] | undefined) => {

                if (selectedNames) {
                  console.log("Selected users = ", selectedNames);
                  const namesOnly = selectedNames.map(u => u.name);
                  const barcodeString = this.barcodeString
                  this.http.post(
                    `http://localhost:8081/api/invoice/sendMail?barcodeString=${barcodeString}`,
                    namesOnly,
                    { responseType: 'text',withCredentials:true }
                  )
                    .subscribe({
                      next: (res) => console.log(res),
                      error: (err) => console.log(err)
                    })
                }
              });
            }

            alert("Upload success");
          },
          error: err => alert("Upload failed:" + err)
        });
    }
    if (this.getRole() == "EMPLOYEE") {
      this.http.post<boolean>('http://localhost:8081/api/invoice/extract/employee', formData, { withCredentials: true })
        .subscribe({
          next: (res) => {
            console.log(res)
            if (res) {
              alert("Parcel picked up successfully")
            }
            else {
              alert("Could not read the barcode on the parcel, try to upload a new image !!!")
            }
            
          }
        })
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