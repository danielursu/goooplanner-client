import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { UserData } from 'src/app/types/jwt.types';
import { InitialsPipe } from 'src/app/pipes/initials.pipe';
import { filter, Subscription } from 'rxjs';

import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { AuthService } from 'src/app/services/auth.service';

interface SidebarMenuItem {
  name: string;
  icon: string;
  route: string;
  ariaLabel?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, InitialsPipe, TooltipModule, MenuModule, AvatarModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Input() isExpanded = false;
  @Input() userData: UserData | null = null;
  @Input() profileColor = '';
  @Output() toggleSidebar = new EventEmitter<void>();

  isDarkTheme = false;
  currentRoute: string = '';
  private routerSubscription?: Subscription;
  items: MenuItem[] = [];

  public menuItems: SidebarMenuItem[] = [
    { 
      name: 'Calendar',
      icon: 'pi pi-calendar',
      route: '/calendar',
      ariaLabel: 'View Calendar'
    },
    { 
      name: 'Team',
      icon: 'pi pi-users',
      route: '/team',
      ariaLabel: 'View Team'
    },
    { 
      name: 'Settings',
      icon: 'pi pi-cog',
      route: '/settings',
      ariaLabel: 'View Settings'
    }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.routerSubscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
        }
      });

    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        command: () => this.router.navigate(['/profile'])
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        command: () => this.router.navigate(['/settings'])
      },
      {
        separator: true
      },
      {
        label: 'Sign Out',
        icon: 'pi pi-sign-out',
        command: () => this.handleLogout()
      }
    ];
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    document.documentElement.setAttribute('data-theme', this.isDarkTheme ? 'dark' : 'light');
  }

  handleLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
