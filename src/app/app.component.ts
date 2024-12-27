import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { JwtService } from './services/jwt.service';
import { UserData } from './types/jwt.types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [RouterOutlet, CommonModule, SidebarComponent]
})
export class AppComponent {
  isSidebarExpanded = false;
  userData: UserData | null = null;

  constructor(private jwtService: JwtService) {
    this.userData = this.jwtService.getUserData();
  }

  onToggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;
  }

  onLogout(): void {
    // Implement logout logic here
    this.userData = null;
    // Navigate to login page or handle logout as needed
  }
}
