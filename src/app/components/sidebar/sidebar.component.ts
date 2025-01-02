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

  items: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user',
      routerLink: '/profile',
      tooltipOptions: {
        tooltipLabel: 'View Profile',
        tooltipPosition: 'right'
      }
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-power-off',
      command: () => {
        this.handleLogout();
      },
      tooltipOptions: {
        tooltipLabel: 'Logout from application',
        tooltipPosition: 'right'
      }
    }
  ];

  constructor(private router: Router) {}

  ngOnInit() {
    if (!this.profileColor) {
      this.profileColor = '#673ab7';
    }
    
    this.loadThemePreference();
    this.initializeRouteTracking();
    
    // Set initial route
    this.currentRoute = this.router.url;
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  private initializeRouteTracking() {
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentRoute = event.urlAfterRedirects;
      }
    });
  }

  toggleTheme() {
    this.isDarkTheme = !this.isDarkTheme;
    this.applyTheme();
    this.saveThemePreference();
  }

  handleKeyPress(event: KeyboardEvent, action: () => void) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  }

  private handleLogout() {
    // Implement logout logic here
    console.log('Logout clicked');
  }

  private applyTheme() {
    const body = document.body;
    if (this.isDarkTheme) {
      body.classList.add('dark');
      body.classList.remove('light');
    } else {
      body.classList.add('light');
      body.classList.remove('dark');
    }
  }

  private loadThemePreference() {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    this.isDarkTheme = savedTheme ? savedTheme === 'dark' : prefersDark;
    this.applyTheme();
  }

  private saveThemePreference() {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }
}
