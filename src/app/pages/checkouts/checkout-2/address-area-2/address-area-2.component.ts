import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnChanges, OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder, FormControl,
  FormGroup, FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import {Division} from '../../../../interfaces/common/division.interface';
import {BehaviorSubject, map, startWith, Subscription} from 'rxjs';
import {DivisionService} from '../../../../services/common/division.service';
import {FilterData} from '../../../../interfaces/core/filter-data';
import {User, UserAddress} from '../../../../interfaces/common/user.interface';
import {UserDataService} from '../../../../services/common/user-data.service';
import {Select} from '../../../../interfaces/core/select';
import {ADDRESS_TYPES} from '../../../../core/utils/app-data';
import {UserService} from '../../../../services/common/user.service';
import {TitleComponent} from "../../../../shared/components/title/title.component";
import {AsyncPipe, JsonPipe, NgClass, TitleCasePipe} from "@angular/common";
import {MatError, MatFormField, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {TranslatePipe} from "../../../../shared/pipes/translate.pipe";
import {SettingService} from "../../../../services/common/setting.service";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {DeliveryCharge} from '../../../../interfaces/common/setting.interface';
import {CurrencyCtrPipe} from '../../../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-address-area-2',
  templateUrl: './address-area-2.component.html',
  standalone: true,
  imports: [
    TitleComponent,
    TitleCasePipe,
    NgClass,
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatOption,
    MatLabel,
    MatError,
    MatInputModule,
    MatAutocompleteModule,
    AsyncPipe,
    TranslatePipe,
    MatRadioGroup,
    MatRadioButton,
    FormsModule,
    CurrencyCtrPipe,
    JsonPipe,
  ],
  styleUrl: './address-area-2.component.scss'
})
export class AddressArea2Component implements OnInit, OnChanges, OnDestroy {

  // Decorator
  @Input() user: User;
  // @Input() cityName!: string;
  @Input() needRefreshForm: boolean = false;
  @Input() deliveryOptionType!: any;
  @Input() productSetting!: any;
  @Input() deliveryCharge: DeliveryCharge;
  @Output() formData = new EventEmitter<any>();
  @ViewChild('formElement') formElement: NgForm;

  filteredDivisions$ = new BehaviorSubject<any[]>([]);
  // divisionControl = new FormControl('');

  // Store Data
  addressTypes: Select[] = ADDRESS_TYPES;
  selectedAddress: UserAddress;
  addresses: UserAddress[] = [];
  titleData = 'Delivery Address';
  titleDataForDeliveryOption = 'Select Delivery Option';
  divisions?: Division[] = [];
  selectedCityOption: string | null = null;


  // Form Control
  dataForm: FormGroup;


  private readonly userDataService = inject(UserDataService);
  private readonly divisionService = inject(DivisionService);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);


  // Subscriptions
  private subscriptions: Subscription[] = [];



  ngOnInit() {
    this.getAllDivision();

    this.dataForm = this.fb.group({
      addressType: [''],
      name: [''],
      phoneNo: ['',[Validators.required, this.mobileOrEmailValidator]],
      division: [''],
      area: [''],
      zone: [''],
      shippingAddress: [''],
      email: [''],

    });

    this.dataForm.valueChanges.subscribe((value) => {
      if (this.productSetting?.productType === 'digitalProduct') {
        if (!this.productSetting?.digitalProduct?.isAddressEnable) {
          this.dataForm.get('shippingAddress')?.setValue('N/A', { emitEvent: false });
        }

        if (!this.productSetting?.digitalProduct?.isDivisionEnable) {
          this.dataForm.get('division')?.setValue('outside-dhaka', { emitEvent: false });
        }

        this.formData.emit(this.dataForm.getRawValue());
      } else {
        this.formData.emit(value);
      }
    });


    // Filter divisions based on input value
    this.dataForm.get('division').valueChanges.pipe(
      startWith(''),
      map(value => this.filterDivisions(value || ''))
    ).subscribe(filtered => {
      this.filteredDivisions$.next(filtered);
    });

    // Base Data
    if (this.userService.isUser) {
      this.getUserAddress();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.needRefreshForm) {
      this.dataForm.markAllAsTouched();
    }
    if (this.user && !this.addresses.length) {
      this.dataForm.patchValue({name: this.user?.name, phoneNo: this.user?.phoneNo});
    }


  }

  private getUserAddress() {
    const subscription = this.userDataService.getUserAddress().subscribe({
      next: res => {
        this.addresses = res.data;
        this.getNextAddressType();
        if (this.addresses.length) {
          this.selectedAddress = this.addresses[0];
          this.dataForm.patchValue(this.selectedAddress);
        }
      },
      error: err => {
        console.log(err);
      }
    });
    this.subscriptions?.push(subscription);
  }


  private getAllDivision() {
    let mSelect = {
      name: 1,
    };
    const filter: FilterData = {
      filter: {status: 'publish'},
      select: mSelect,
      pagination: null,
      sort: {name: 1},
    };

    const subscription = this.divisionService.getAllDivisions(filter).subscribe({
      next: res => {
        this.divisions = res.data;
        this.filteredDivisions$.next(this.divisions);
      },
      error: err => {
        console.log(err);
      }
    });
    this.subscriptions?.push(subscription);
  }

  /***
   * On Selection Change
   * onChangeDivision()
   * onChangeArea()
   */

  onSelectAddress(item: UserAddress) {
    this.selectedAddress = item;
    this.dataForm.patchValue(this.selectedAddress);
  }

  onAddNewAddress() {
    this.selectedAddress = null;
    this.formElement.resetForm();
    this.getNextAddressType();
  }

  getNextAddressType() {
    const usedTypes = this.addresses.map(addr => addr.addressType);
    const unusedType = this.addressTypes.find(type => !usedTypes.includes(type.value));
    const result = unusedType ? unusedType.value : null;
    this.dataForm.patchValue({addressType: result});
  }

  private filterDivisions(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.divisions.filter(division =>
      division.name.toLowerCase().includes(filterValue)
    );
  }


  restrictMaxLength(event: any): void {
    const input = event.target;
    if (input.value.length > 11) {
      input.value = input.value.slice(0, 11);
    }
    this.dataForm.get('phoneNo')?.setValue(input.value);
  }

  mobileOrEmailValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const isMobile = /^(?:\+88)?01[3-9]\d{8}$/.test(value);

    if (!isMobile) {
      return { invalidInput: true };
    }
    if (isMobile && value.length > 11) {
      return { maxlength: true };
    }
    return null;
  }

  /**
   * On Destroy
   */
  ngOnDestroy() {
    this.subscriptions?.forEach(sub => sub?.unsubscribe());
  }

}
