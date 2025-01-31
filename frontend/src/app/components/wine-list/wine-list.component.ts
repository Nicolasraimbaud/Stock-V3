import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Wine } from '../../models/wine';
import { WineService } from '../../services/wine.service';


@Component({
  selector: 'app-wine-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './wine-list.component.html',
  styleUrls: ['./wine-list.component.css'] 
})

export class WineListComponent implements OnInit {
  wines: Wine[] = [];

  constructor(private wineService: WineService) { }

  ngOnInit(): void {
    this.getWines();
  }

  getWines(): void {
    this.wineService.getWines().subscribe(
      data => this.wines = data
    );
  }

  importExcelData(): void {
    this.wineService.importExcelData().subscribe({
      next: (response) => {
        console.log('Excel data imported successfully:', response);
        this.getWines(); // Reload wines after import
      },
      error: (error) => {
        console.error('Error importing Excel data:', error);
      }
    });
  }

  printWineList(): void {
    // TO DO: implement print functionality
  }
}