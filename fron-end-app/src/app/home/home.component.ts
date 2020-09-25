import { Component, OnInit } from '@angular/core';

import{  HistoryModel } from "../shared/models"

import { HistoryService } from '../services/history.service';
declare var $: any;
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  history: Array<HistoryModel>;

  constructor(historyservice:HistoryService) 
  {
   
  }
  
  ngOnInit(): void {
   
  }

  
}
