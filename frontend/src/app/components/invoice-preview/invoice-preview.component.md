# Invoice Preview Component

## Overview
The Invoice Preview Component is an Angular component that provides an interactive interface for reviewing and editing OCR-processed wine invoice data. It serves as a crucial intermediary step between the OCR processing of wine invoices and the final data storage.

## Features

### 1. Data Display
- Presents wine invoice data in a structured table format
- Displays key wine information including:
  - Domaine (winery)
  - Appellation
  - Qualité (quality)
  - Cuvée
  - Millésime (vintage)
  - Unité (unit)
  - Quantité (quantity)
  - Prix Unitaire (unit price)
  - Prix Total (total price)

### 2. Interactive Editing
- All fields are editable through input fields
- Real-time data binding using ngModel
- Supports correction of OCR misreadings
- Numeric fields are specially formatted for prices and quantities

### 3. Data Validation
The component includes robust data validation through the `validateChanges()` method:
- Converts string values to appropriate number formats
- Handles special cases like 'NM' (non-millésimé) for vintage
- Provides default values for missing data
- Validates and processes data before storage

### 4. Data Processing
- Price conversion: Handles decimal formatting (commas to periods)
- Type conversion: Ensures proper data types for all fields
- Null handling: Provides fallback values (0 or empty string)

## Technical Details

### Input Properties
```typescript
@Input() ocrResults: {
  rows: {
    Domaine: string,
    Appellation: string,
    Qualite: string,
    Cuvee: string,
    Millesime: string,
    Unite: string,
    Quantite: number,
    PrixUnitaire: string,
    PrixTotal: string
  }[]
}
```

### Key Methods
- `validateChanges()`: Processes and validates data before saving
- `convertToNumber()`: Handles numeric conversion with error handling

### Dependencies
- CommonModule
- FormsModule
- HttpClient
- WineService

## Usage
The component is typically used after OCR processing of wine invoices:
1. OCR results are passed to the component
2. Users can review and edit the data
3. Data is validated and processed upon confirmation
4. Processed data is sent to the WineService for storage

## Styling
The component includes specific styling classes for different types of data:
- `.editable-field`: Basic input styling
- `.numeric-field`: Specific styling for numeric inputs
- `.prix-cell`: Special formatting for price cells