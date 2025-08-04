import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttendanceService } from '../../services/attendance.service';
import { TranslateModule } from '@ngx-translate/core';
import { ArabicDatePipe } from '../../pipes/arabic-date.pipe';
import { interval} from 'rxjs';
import { UserService } from '../../services/user.service';
import { ArabicTimePipe } from '../../pipes/arabic-time.pipe';

@Component({
  selector: 'attendance-card',
  standalone: true,
  imports: [CommonModule, TranslateModule, ArabicDatePipe , ArabicTimePipe],
  templateUrl: './attendance-card.component.html',
  styleUrls: ['./attendance-card.component.scss'],
})

export class AttendanceCardComponent {
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
