import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CalendarEvent, EventType } from '../../types/calendar.types';

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
    InputTextareaModule
  ],
  template: `
    <form [formGroup]="eventForm" (ngSubmit)="onSubmit()" class="event-form">
      <div class="field">
        <label for="title">Title</label>
        <input id="title" type="text" pInputText formControlName="title" class="w-full">
        <small class="p-error" *ngIf="eventForm.get('title')?.invalid && eventForm.get('title')?.touched">
          Title is required
        </small>
      </div>

      <div class="field">
        <label for="type">Event Type</label>
        <p-dropdown id="type"
          [options]="eventTypeOptions"
          formControlName="type"
          optionLabel="label"
          optionValue="value"
          class="w-full">
        </p-dropdown>
      </div>

      <div class="field">
        <label for="start">Start Date</label>
        <p-calendar id="start"
          formControlName="start"
          [showTime]="true"
          [showIcon]="true"
          class="w-full">
        </p-calendar>
      </div>

      <div class="field">
        <label for="end">End Date</label>
        <p-calendar id="end"
          formControlName="end"
          [showTime]="true"
          [showIcon]="true"
          [minDate]="eventForm.get('start')?.value"
          class="w-full">
        </p-calendar>
      </div>

      <div class="field">
        <label for="description">Description</label>
        <textarea id="description"
          pInputTextarea
          formControlName="description"
          [rows]="3"
          class="w-full">
        </textarea>
      </div>

      <div class="dialog-footer">
        <p-button 
          label="Cancel" 
          (onClick)="onCancel()" 
          styleClass="p-button-text">
        </p-button>
        <p-button 
          [label]="data.event ? 'Update' : 'Create'"
          type="submit"
          [disabled]="!eventForm.valid"
          styleClass="p-button-primary">
        </p-button>
        <p-button 
          *ngIf="data.event"
          label="Delete" 
          (onClick)="onDelete()"
          styleClass="p-button-danger p-button-text">
        </p-button>
      </div>
    </form>
  `,
  styles: [`
    :host ::ng-deep {
      .event-form {
        padding: 1.5rem;
        
        .field {
          margin-bottom: 1.5rem;
          
          label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
          }
        }
        
        .p-calendar {
          width: 100%;
        }
        
        .dialog-footer {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
          margin-top: 2rem;
        }
        
        .p-inputtext {
          width: 100%;
        }
      }
    }
  `]
})
export class EventDialogComponent implements OnInit {
  eventForm: FormGroup;
  data: any;

  eventTypeOptions = [
    { label: 'Vacation', value: EventType.VACATION },
    { label: 'Sick Leave', value: EventType.SICK_LEAVE },
    { label: 'Remote Work', value: EventType.REMOTE_WORK }
  ];

  constructor(
    private fb: FormBuilder,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.data = config.data;
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      type: [EventType.VACATION],
      start: [this.data.start || null],
      end: [this.data.end || null],
      description: ['']
    });

    if (this.data.event) {
      this.eventForm.patchValue({
        title: this.data.event.title,
        type: this.data.event.type,
        start: new Date(this.data.event.start),
        end: this.data.event.end ? new Date(this.data.event.end) : null,
        description: this.data.event.description
      });
    }
  }

  ngOnInit() {}

  onSubmit() {
    if (this.eventForm.valid) {
      const formValue = this.eventForm.value;
      const event: Partial<CalendarEvent> = {
        title: formValue.title,
        type: formValue.type,
        start: formValue.start?.toISOString(),
        end: formValue.end?.toISOString(),
        description: formValue.description
      };

      if (this.data.event) {
        event.id = this.data.event.id;
      }

      this.ref.close(event);
    }
  }

  onCancel() {
    this.ref.close();
  }

  onDelete() {
    this.ref.close({ delete: true });
  }
}
