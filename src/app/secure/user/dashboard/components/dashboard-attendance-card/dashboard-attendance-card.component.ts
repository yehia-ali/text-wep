import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { interval} from 'rxjs';
import { ArabicDatePipe } from 'src/app/core/pipes/arabic-date.pipe';
import { ArabicTimePipe } from 'src/app/core/pipes/arabic-time.pipe';
import { AttendanceService } from 'src/app/core/services/attendance.service';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'dashboard-attendance-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicDatePipe , ArabicTimePipe],
  templateUrl: './dashboard-attendance-card.component.html',
  styleUrls: ['./dashboard-attendance-card.component.scss'],
})

export class DashboardAttendanceCardComponent {
  lastAttendance: any;
  @Output() statusChanged = new EventEmitter();
  clickable = true;
  workingHours: any = '00:00:00';
  shiftStart :any
  shiftEnd :any
  constructor(private service: AttendanceService , private userService : UserService) {}

  ngOnInit(): void {
    this.getLastAttendance();
    setTimeout(() => {
      const firstCheck = new Date(this.lastAttendance.firstCheckIn)
      const now = new Date();
      const diff = now.getTime() - firstCheck.getTime();
      this.workingHours = this.msToTime(diff);
    }, 1000);

    this.userService.getMyProfile().subscribe((res:any) => {
      this.shiftStart =res.data.checkIn
      this.shiftEnd =res.data.checkOut
    })
  }

  getLastAttendance() {
    this.service.getLastAttendance().subscribe((res: any) => {
      this.lastAttendance = res.data;
      this.clickable = true;
    });
  }

  check(status = 1) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        if (this.clickable) {
          this.clickable = false;
          const data = {
            status,
            macAddress: null,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
          this.service.check(data).subscribe(() => {
            this.getLastAttendance();
            this.statusChanged.emit();
          });
        }
      });
    }
  }


  msToTime(duration: number){
    let seconds = Math.floor((duration / 1000) % 60);
    let minutes = Math.floor((duration / (1000 * 60)) % 60);
    let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    console.log(seconds , minutes , hours)
    const timer$ = interval(1000);

    timer$.subscribe(() => {

      seconds++;
      if(seconds >= 60){
        seconds = 0
        minutes++
      }
      if(minutes >= 60){
        minutes = 0;
        hours++
      }
      this.workingHours = `${hours<10 ? '0'+ (hours - 3) : (hours - 3)}:${minutes<10 ? '0'+minutes : minutes}:${seconds<10 ? '0'+seconds : seconds}`;
    });
  }

}
