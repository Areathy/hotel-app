import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationsComponent } from '../components/notifications/notifications.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private matSnackbar: MatSnackBar) { }

  showNotification(message: string, buttonText: string) {
    //snackbar / notification
    this.matSnackbar.openFromComponent(NotificationsComponent, {
      duration: 15000,
      horizontalPosition: "center",
      verticalPosition: "top",
      panelClass: "notification-panel "
    });
  }
}
