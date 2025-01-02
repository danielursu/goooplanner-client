import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  FormBuilder, 
  FormGroup, 
  FormControl,
  ReactiveFormsModule, 
  Validators 
} from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextarea } from 'primeng/inputtextarea';
import { CalendarEvent, EventType } from '../../types/calendar.types';

interface EventFormData {
  title: string;
  type: EventType;
  start: Date | null;
  end: Date | null;
  description: string;
}

interface DialogData {
  event?: CalendarEvent;
  start?: Date;
  end?: Date;
}

type EventFormGroup = FormGroup<{
  title: FormControl<string | null>;
  type: FormControl<EventType | null>;
  start: FormControl<Date | null>;
  end: FormControl<Date | null>;
  description: FormControl<string | null>;
}>;

@Component({
  selector: 'app-event-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    InputTextarea
  ],
  templateUrl: './event-dialog.component.html',
  styleUrls: ['./event-dialog.component.scss']
})
export class EventDialogComponent implements OnInit {
  eventForm!: EventFormGroup;
  data: DialogData;

  readonly eventTypeOptions = [
    { label: 'Vacation', value: EventType.VACATION },
    { label: 'Sick Leave', value: EventType.SICK_LEAVE },
    { label: 'Remote Work', value: EventType.REMOTE_WORK }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig<DialogData>
  ) {
    this.data = config.data ?? { start: new Date(), end: new Date() };
    this.initializeForm();
  }

  ngOnInit(): void {
    this.setupFormValidation();
  }

  private initializeForm(): void {
    this.eventForm = this.fb.group({
      title: new FormControl<string | null>('', [Validators.required, Validators.minLength(3)]),
      type: new FormControl<EventType | null>(EventType.VACATION, [Validators.required]),
      start: new FormControl<Date | null>(this.data.start || null, [Validators.required]),
      end: new FormControl<Date | null>(this.data.end || null, [Validators.required]),
      description: new FormControl<string | null>('')
    }) as EventFormGroup;

    if (this.data.event) {
      this.patchFormWithEventData(this.data.event);
    }
  }

  private patchFormWithEventData(event: CalendarEvent): void {
    this.eventForm.patchValue({
      title: event.title,
      type: event.type,
      start: event.start ? new Date(event.start) : null,
      end: event.end ? new Date(event.end) : null,
      description: event.description || ''
    });
  }

  private setupFormValidation(): void {
    const startControl = this.eventForm.get('start');
    const endControl = this.eventForm.get('end');

    startControl?.valueChanges.subscribe(startDate => {
      if (startDate && endControl?.value) {
        const endDate = new Date(endControl.value);
        if (endDate < new Date(startDate)) {
          endControl.setValue(startDate);
        }
      }
    });
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.getRawValue();
      const event: Partial<CalendarEvent> = {
        title: formValue.title || '',
        type: formValue.type || EventType.VACATION,
        start: formValue.start?.toISOString(),
        end: formValue.end?.toISOString(),
        description: formValue.description || ''
      };

      if (this.data.event) {
        event.id = this.data.event.id;
      }

      this.ref.close(event);
    } else {
      this.markFormGroupTouched(this.eventForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  onCancel(): void {
    this.ref.close();
  }

  onDelete(): void {
    this.ref.close({ delete: true });
  }

  getErrorMessage(controlName: string): string {
    const control = this.eventForm.get(controlName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required`;
      }
      if (control.errors['minlength']) {
        return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} must be at least ${control.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}
