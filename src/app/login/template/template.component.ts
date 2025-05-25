import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UsertypeService } from '../services/usertype.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.css']
})
export class TemplateComponent implements OnInit {
    year: number = new Date().getFullYear();
     imageSrc: string = '';
  text: string = '';
  backgroundColor: string = '';
  backgroundImage: string = '';

  constructor(private userTypeService: UsertypeService) {}

  ngOnInit(): void {
  const savedType = localStorage.getItem('userType') as 'funcionario' | 'candidato' | 'administrador' | null;

  if (savedType) {
    this.userTypeService.setUserType(savedType);
  }

  this.userTypeService.userTypeData$.subscribe(data => {
    this.imageSrc = data.imageSrc;
    this.text = data.text;
    this.backgroundColor = data.backgroundColor;
    this.backgroundImage = data.backgroundImage;
  });
}
}