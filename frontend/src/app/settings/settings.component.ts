import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HelperService } from '../services/helpers.service';
import * as XLSX from 'xlsx';
import { tap } from 'rxjs/operators';
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  isLoading: boolean = false;

  constructor(private helperService: HelperService) {}
  DownloadAllClient() {
    this.isLoading = true;
    this.helperService
      .getAllClients()
      .pipe(
        tap(() => {
          this.isLoading = false;
        })
      )
      .subscribe((data: any) => {
        const wb = XLSX.read(data.result, { type: 'base64' });
        XLSX.writeFile(wb, `Усі клієнти.xlsx`);
      }, this.helperService.ShowError);
  }
}
