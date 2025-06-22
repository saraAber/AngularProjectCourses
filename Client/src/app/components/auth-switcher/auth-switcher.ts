import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'auth-switcher',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './auth-switcher.html',
  styleUrl: './auth-switcher.css'
})
export class AuthSwitcher {
  // אין צורך להוסיף קוד נוסף, הכל מתבצע דרך הראוטינג
}
