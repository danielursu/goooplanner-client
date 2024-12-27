import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UserData } from 'src/app/types/jwt.types';
import { InitialsPipe } from 'src/app/pipes/initials.pipe';

import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, InitialsPipe, TooltipModule, MenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent {
  @Input() isExpanded = false;
  @Input() userData: UserData | null = null;
  @Input() profileColor = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  public menuItems = [
    { name: 'Calendar', icon: 'pi pi-calendar', route: '/calendar' },
    { name: 'Team', icon: 'pi pi-users', route: '/team' },
    { name: 'Settings', icon: 'pi pi-cog', route: '/settings' }
  ];

  items: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      routerLink: '/profile'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-power-off',
      command: () => {
        // Add your logout logic here
        console.log('Logout clicked');
      }
    }
  ];

  ngOnInit() {
    if (!this.profileColor) {
      this.profileColor = '#673ab7'; // Default background color
    }
  }
}
