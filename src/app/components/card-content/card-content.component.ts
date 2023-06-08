import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-content',
  templateUrl: './card-content.component.html',
  styleUrls: ['./card-content.component.css']
})
export class CardContentComponent {
  @Input() image: string | undefined
  @Input() infoTitle: string | undefined
  @Input() infoText1: string | undefined
  @Input() infoText2: string | undefined
  @Input() single: boolean = true

}
