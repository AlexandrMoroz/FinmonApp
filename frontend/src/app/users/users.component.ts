import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UsersService } from '../services/users.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { UserModel } from '../shared/models';
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  settings = {
    actions: { columnTitle: '' },
    class: 'user-table',
    add: {
      addButtonContent: '<i class="fas fa-plus"></i>',
      createButtonContent: '<i class="fas fa-check"></i>',
      cancelButtonContent: '<i class="fas fa-times-circle"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="fas fa-edit"></i>',
      saveButtonContent: '<i class="fas fa-save"></i>',
      cancelButtonContent: '<i class="fas fa-times-circle"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="fas fa-trash-alt"></i>',
      confirmDelete: true,
    },
    columns: {
      block: {
        title: 'Заблокирован',
           editor: {
          type: 'checkbox',

        },
      },
      name: {
        title: 'Имя',
        type: 'string',
      },
      family: {
        title: 'Фамилия',
        type: 'string',
      },
      surname: {
        title: 'Отчество',
        type: 'string',
      },
      username: {
        title: 'Логин',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
      password: {
        title: 'Пароль',
        type: 'number',
      },
      confirmPassword: {
        title: 'Подтверждение пароля',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  users: UserModel[];

  isLoading: boolean = false;
  constructor(
    private service: UsersService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.isLoading = true;
    this.service.getAll().subscribe(
      (data: any) => {
        this.users = data.users as UserModel[];
        this.source.load(this.users);
        this.isLoading = false;
      },
    );
  }
  ngOnInit(): void {}
  removeEmpty(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, v]) => {
        return v != null && v !== '';
      })
    );
  }
  onCreateConfirm(event): void {
    if (!this.validate(event.newData)) return;
    this.service.createUser(event.newData).subscribe(
      (data: any) => {
        this.flashMessagesService.show('Пользователь успешно добавлен', {
          cssClass: 'alert-success',
          timeout: 7000,
        });
        event.newData.password = '';
        event.newData.confirmPassword = '';
        this.users = [event.newData, ...this.users];
        this.source.load(this.users);
      },
    );
  }
  onEditConfirm(event): void {
    let editUser = this.removeEmpty(event.newData);
    
    if (!this.validate(editUser, true)) return;

    this.service.editUser(editUser).subscribe(
      (data: any) => {
        this.flashMessagesService.show('Пользователь успешно изменен', {
          cssClass: 'alert-success',
          timeout: 7000,
        });
        event.newData.password = '';
        event.newData.confirmPassword = '';
        this.users = this.users.filter((item) => item.id !== event.newData.id);
        this.users = [event.newData, ...this.users];
        this.source.load(this.users);
      },
    );
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Ви впевнені що хочете видалити користувача?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  validate(user, isEdit = false): boolean {
    if (user.password !== user.confirmPassword) {
      this.flashMessagesService.show(
        `Пароли не совпадают ${user.password} или ${user.confirmPassword}`,
        { cssClass: 'alert-danger', timeout: 7000 }
      );
      return false;
    }
    //if edition validate
    if (isEdit) {
      if (
        this.users.filter((item) => item.username === user.username).length > 1
      ) {
        this.flashMessagesService.show(
          `Логин пользователя должен быть уникальным`,
          { cssClass: 'alert-danger', timeout: 7000 }
        );
        return false;
      }
    } else if (this.users.some((item) => item.username === user.username)) {
      this.flashMessagesService.show(
        `Логин пользователя должен быть уникальным`,
        { cssClass: 'alert-danger', timeout: 7000 }
      );
      return false;
    }
    if (isEdit) {
      if (!user.username) {
        this.flashMessagesService.show(`Поле логин должно быть заполнено`, {
          cssClass: 'alert-danger',
          timeout: 7000,
        });
        return false;
      }
    } else if (!user.password || !user.password || !user.username) {
      this.flashMessagesService.show(
        `Поля пароль, подтверждение пароля, и логин должны быть заполнены`,
        { cssClass: 'alert-danger', timeout: 7000 }
      );
      return false;
    }
    if (!user.username.match(/^[a-zA-Zа-яА-Я1-9]*$/)) {
      this.flashMessagesService.show(
        `Поле логин должно содержать только буквы и цифры `,
        {
          cssClass: 'alert-danger',
          timeout: 7000,
        }
      );
      return false;
    }
    return true;
  }
}
