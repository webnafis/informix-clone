import {Component} from '@angular/core';
import {AccountSidebarComponent} from "../../../shared/components/account-sidebar/account-sidebar.component";
import {MobileHeaderComponent} from "../../../shared/components/core/mobile-header/mobile-header.component";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatButton, MatIconButton} from "@angular/material/button";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {PasswordManageComponent} from "./password-manage/password-manage.component";
import {AccountStatusComponent} from "./account-status/account-status.component";
import {ConfirmDialogComponent} from "../../../shared/dialog/confirm-dialog/confirm-dialog.component";
import {MatDialogModule} from "@angular/material/dialog";

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrl: './setting.component.scss',
  standalone: true,
  imports: [
    AccountSidebarComponent,
    MobileHeaderComponent,
    MatError,
    MatLabel,
    MatFormField,
    MatIcon,
    MatInput,
    MatIconButton,
    MatButton,
    ReactiveFormsModule,
    FormsModule,
    PasswordManageComponent,
    AccountStatusComponent,
    ConfirmDialogComponent,
    MatDialogModule,
  ]
})
export class SettingComponent { }
