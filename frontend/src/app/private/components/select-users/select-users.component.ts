import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { UserInterface } from 'src/app/model/user.interface';
import { UserService } from 'src/app/public/services/user-service/user.service';

@Component({
  selector: 'app-select-users',
  templateUrl: './select-users.component.html',
  styleUrls: ['./select-users.component.scss'],
})
export class SelectUsersComponent implements OnInit {
  @Input() users: UserInterface[] = [];
  @Output() addUser: EventEmitter<UserInterface> =
    new EventEmitter<UserInterface>();
  @Output() removeUser: EventEmitter<UserInterface> =
    new EventEmitter<UserInterface>();

  searchUsername = new FormControl();
  filteredUsers: UserInterface[] = [];
  // @ts-ignore
  selectedUser: UserInterface = null;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.searchUsername.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((username: string) =>
          this.userService
            .findByUsername(username)
            .pipe(tap((users: any) => (this.filteredUsers = users.items)))
        )
      )
      .subscribe();
  }

  addUserToForm() {
    this.addUser.emit(this.selectedUser);
    this.filteredUsers = [];
    // @ts-ignore
    this.selectedUser = null;
    this.searchUsername.setValue(null);
  }

  removeUserFromForm(user: UserInterface) {
    this.removeUser.emit(user);
  }

  setSelectedUser(user: UserInterface) {
    this.selectedUser = user;
  }

  displayFn(user: any) {
    if (user) {
      return user.username;
    } else {
      return '';
    }
  }
}
