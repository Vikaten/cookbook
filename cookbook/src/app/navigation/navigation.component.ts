import {Component, inject, Input} from '@angular/core';
import {RolesService} from "../roles.service";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent {
  protected rolesService: RolesService = inject(RolesService);
}
