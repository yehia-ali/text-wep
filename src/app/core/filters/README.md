# Date Time Filter Component

A reusable Angular component for date and time selection with a modern design that matches the application's UI patterns.

## Features

- **Bilingual Support**: Supports both Arabic (RTL) and English (LTR) layouts
- **Modern Design**: Clean white input field with rounded corners and calendar icon
- **Customizable**: Various input properties for different use cases
- **Accessible**: Follows Angular Material design patterns
- **Responsive**: Adapts to different screen sizes

## Usage

### Basic Usage

```html
<date-time-filter 
  [selectedValue]="selectedDateTime"
  (valueChanged)="onDateTimeChange($event)">
</date-time-filter>
```

### With Custom Properties

```html
<date-time-filter 
  [selectedValue]="selectedDateTime"
  [width]="'w-20'"
  [minDate]="minDate"
  [clearable]="true"
  [readOnly]="false"
  [hideLabel]="false"
  [placeholder]="'select_date'"
  (valueChanged)="onDateTimeChange($event)">
</date-time-filter>
```

## Input Properties

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `selectedValue` | `any` | `''` | The selected date/time value |
| `key` | `string` | `'date_time'` | Translation key for the label |
| `width` | `string` | `'w-16r'` | CSS width class |
| `classes` | `string` | `''` | Additional CSS classes |
| `minDate` | `string` | `''` | Minimum selectable date |
| `clearable` | `boolean` | `true` | Whether to show clear button |
| `readOnly` | `boolean` | `false` | Whether the input is read-only |
| `hideLabel` | `boolean` | `false` | Whether to hide the label |
| `placeholder` | `string` | `'select_date'` | Placeholder text translation key |

## Output Events

| Event | Type | Description |
|-------|------|-------------|
| `valueChanged` | `EventEmitter<any>` | Emitted when the date/time value changes |

## Styling

The component uses the following CSS classes:

- `.date_time_filter`: Main container
- `.filter-header`: Header section with label and icon
- `.calendar-icon`: Calendar icon styling
- `.date-time-input`: Input field styling
- `.picker-icon`: Date picker toggle icon
- `.clear`: Clear button styling

## Design Features

- **Label**: Dark gray text with Arabic/English translation
- **Calendar Icon**: Small calendar icon next to the label
- **Input Field**: White background with rounded corners
- **Focus State**: Blue border and shadow on focus
- **Read-only State**: Gray background when read-only
- **Clear Button**: X icon to clear the value

## Translation Keys

The component uses these translation keys:
- `date_time`: "التاريخ / الوقت" (Arabic) / "Date / Time" (English)
- `select_date`: "اختر التاريخ" (Arabic) / "Select Date" (English)

## Example Component

See `date-time-filter-example.component.ts` for a complete usage example with different configurations.

## Dependencies

- Angular Material Date Picker
- Moment.js for date formatting
- BoxIcons for calendar icon
- ngx-translate for internationalization 