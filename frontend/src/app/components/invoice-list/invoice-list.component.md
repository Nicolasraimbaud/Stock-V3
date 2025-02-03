# InvoiceListComponent Documentation

The `InvoiceListComponent` is an Angular component responsible for managing and displaying a list of invoices within the application. Below is a detailed explanation of its structure, functionality, and interactions:

## 1. Component Metadata

```typescript
@Component({
  selector: 'app-invoice-list',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.css']
})
```

- **Selector**: `'app-invoice-list'` allows this component to be used in templates via the `<app-invoice-list></app-invoice-list>` tag.
- **Standalone**: `true` indicates that this is a standalone component, meaning it doesn't need to be declared in an NgModule.
- **Imports**: Lists the Angular modules used by this component:
  - `ReactiveFormsModule` and `FormsModule` for handling forms.
  - `CommonModule` for common Angular directives.
  - `RouterModule` for navigation-related functionalities.
- **Template and Styles**: Points to the HTML and CSS files that define the component's view and styling.

## 2. Class Definition and Properties

```typescript
export class InvoiceListComponent implements OnInit {
  @ViewChild('addInvoiceModal') addInvoiceModal!: TemplateRef<Invoice>;
  @ViewChild('ocrResultsModal') ocrResultsModal!: TemplateRef<Invoice>;
  invoices: Invoice[] = [];
  invoiceForm: FormGroup;
  selectedFile: File | null = null;
  results: Invoice[] = [];
  searchTerm = '';
  statusOptions = [
    { value: 'en_cours', label: 'En Cours' },
    { value: 'a_regler', label: 'À Régler' },
    { value: 'termine', label: 'Terminé' }
  ];
```

- **ViewChild Decorators**:
  - `addInvoiceModal`: References the template for adding a new invoice.
  - `ocrResultsModal`: References the template for displaying OCR results.
- **invoices**: An array to store and display the list of invoices.
- **invoiceForm**: A reactive form group for handling invoice data input.
- **selectedFile**: Holds the file selected by the user for OCR processing.
- **results**: Stores the results obtained from OCR processing.
- **searchTerm**: Holds the current search term for filtering invoices.
- **statusOptions**: An array of status options for invoices, each with a `value` and a `label`.

## 3. Constructor and Dependency Injection

```typescript
constructor(
  private fb: FormBuilder,
  private dialog: MatDialog,
  private invoiceService: InvoiceService,
  private http: HttpClient,
  private route: ActivatedRoute
) {
  this.invoiceForm = this.fb.group({
    supplier: [''],
    email: [''],
    date: [''],
    total: [''],
    status: ['en_cours'],
  });
}
```

- **Injected Services**:
  - `FormBuilder`: Helps in constructing the reactive form.
  - `MatDialog`: Facilitates opening and managing dialog modals.
  - `InvoiceService`: Handles API calls related to invoices.
  - `HttpClient`: Enables HTTP requests.
  - `ActivatedRoute`: Provides access to information about a route associated with a component.
- **Form Initialization**: The `invoiceForm` is initialized with default values for fields like `supplier`, `email`, `date`, `total`, and `status` (defaulting to `'en_cours'`).

## 4. Lifecycle Hook - OnInit

```typescript
ngOnInit(): void {
  this.route.url.subscribe(() => {
    this.loadInvoices();
  });
}
```

- **Purpose**: When the component initializes, it subscribes to changes in the route URL. On any change, it triggers the `loadInvoices()` method to fetch and display the latest invoices.

## 5. Methods

### a. loadInvoices

```typescript
loadInvoices(): void {
  console.log('Début du chargement des factures...');
  this.invoiceService.getInvoices().subscribe({
    next: (data) => {
      console.log('Factures reçues :', data);
      this.invoices = data;
    },
    error: (error) => {
      console.error('Erreur lors du chargement des factures :', error);
    },
    complete: () => {
      console.log('Chargement des factures terminé');
    },
  });
}
```

- **Functionality**: Fetches the list of invoices from the backend using the `InvoiceService`.
- **Logging**: Logs messages to the console at the start, upon receiving data, and upon completion or error.
- **Data Handling**: Updates the `invoices` array with the fetched data.

### b. openAddInvoiceModal

```typescript
openAddInvoiceModal(): void {
  this.dialog.open(this.addInvoiceModal);
}
```

- **Functionality**: Opens a modal dialog for adding a new invoice using Angular Material's `MatDialog`.

### c. openOcrResultsModal

```typescript
openOcrResultsModal(): void {
  this.dialog.open(this.ocrResultsModal, {
    width: '80%',
    data: { results: this.results },
  });
}
```

- **Functionality**: Opens a modal to display OCR results.
- **Configuration**: Sets the modal width to 80% and passes the `results` data to the modal.

### d. onFileSelected

```typescript
onFileSelected(event: Event): void {
  const target = event.target as HTMLInputElement;
  this.selectedFile = target.files?.[0] || null;
}
```

- **Purpose**: Handles the event when a user selects a file.
- **Functionality**: Assigns the selected file to the `selectedFile` property. If no file is selected, sets it to `null`.

### e. onSubmit

```typescript
onSubmit(): void {
  if (!this.selectedFile) {
    console.error('Aucun fichier sélectionné');
    return;
  }

  const formData = new FormData();
  formData.append('supplier', this.invoiceForm.value.supplier);
  formData.append('email', this.invoiceForm.value.email);
  formData.append('date', this.invoiceForm.value.date);
  formData.append('total', this.invoiceForm.value.total);
  formData.append('status', this.invoiceForm.value.status);
  formData.append('file', this.selectedFile);

  this.invoiceService.processOcrFile(formData).subscribe(
    (response: Invoice[]) => {
      console.log('Résultats OCR obtenus avec succès', response);
      this.results = response;
      this.dialog.closeAll();
      this.openOcrResultsModal();
    },
    (error) => {
      console.error('Erreur lors du traitement du fichier', error);
    }
  );
}
```

- **Functionality**:
  - **Validation**: Checks if a file is selected. If not, logs an error and exits.
  - **FormData Creation**: Constructs a `FormData` object containing form values and the selected file.
  - **API Call**: Sends the `FormData` to the backend via `InvoiceService` for OCR processing.
  - **Handling Response**:
    - On success: Logs the response, updates `results`, closes all dialogs, and opens the OCR results modal.
    - On error: Logs the error.

### f. saveResults

```typescript
saveResults(): void {
  this.invoiceService.saveUpdatedRows(this.results).subscribe({
    next: () => {
      console.log('Données enregistrées avec succès');
      this.results = [];
      this.loadInvoices();
    },
    error: (error) => {
      console.error('Erreur lors de l\'enregistrement des données :', error);
    },
  });
}
```

- **Functionality**: Saves the updated OCR results to the backend.
- **Handling Response**:
  - On success: Logs a success message, clears the `results`, and reloads the invoices.
  - On error: Logs the error.

### g. updateInvoiceStatus

```typescript
updateInvoiceStatus(invoice: Invoice, newStatus: string): void {
  if (invoice.id === undefined) {
    console.error('Cannot update status: Invoice ID is undefined');
    return;
  }

  const oldStatus = invoice.status;
  invoice.status = newStatus;
  invoice.saving = true;

  this.invoiceService.updateInvoiceStatus(invoice.id, newStatus).subscribe({
    next: () => {
      console.log('Statut mis à jour avec succès');
      invoice.saving = false;
    },
    error: (error) => {
      console.error('Erreur lors de la mise à jour du statut:', error);
      invoice.status = oldStatus;
      invoice.saving = false;
    }
  });
}
```

- **Functionality**:
  - **Validation**: Ensures the invoice has a valid `id`. If not, logs an error and exits.
  - **Status Update**: Temporarily updates the invoice's status and sets a `saving` flag to `true`.
  - **API Call**: Sends the new status to the backend via `InvoiceService`.
- **Handling Response**:
  - On success: Logs a success message and clears the `saving` flag.
  - On error: Logs the error, reverts the status to its original value, and clears the `saving` flag.

### h. deleteInvoice

```typescript
deleteInvoice(invoiceId: number): void {
  this.invoiceService.deleteInvoice(invoiceId).subscribe({
    next: () => {
      console.log('Facture supprimée avec succès');
      this.loadInvoices();
    },
    error: (error) => {
      console.error('Erreur lors de la suppression de la facture:', error);
    }
  });
}
```

- **Functionality**: Deletes an invoice by its `id` using the `InvoiceService`.
- **Handling Response**:
  - On success: Logs a success message and reloads the invoice list.
  - On error: Logs the error.

## 6. Interaction with Services

- **InvoiceService**:
  - **getInvoices()**: Fetches the list of invoices.
  - **processOcrFile(formData: FormData)**: Processes the uploaded invoice file for OCR.
  - **saveUpdatedRows(results: Invoice[])**: Saves the updated OCR results.
  - **updateInvoiceStatus(id: number, status: string)**: Updates the status of a specific invoice.
  - **deleteInvoice(id: number)**: Deletes a specific invoice.

## 7. User Interface Interactions

- **Modal Dialogs**:
  - **Add Invoice Modal**: Allows users to add a new invoice.
  - **OCR Results Modal**: Displays the results of the OCR processing.
- **Form Handling**:
  - **Invoice Form**: Collects data such as supplier, email, date, total amount, and status.
  - **File Selection**: Handles the selection of a file for OCR processing.
- **Status Management**:
  - Users can update the status of invoices (e.g., "En Cours", "À Régler", "Terminé").
  - The component manages optimistic UI updates and reverts changes in case of errors.

## 8. Error Handling and Logging

- **Console Logging**: Throughout the component, `console.log` and `console.error` are used to log informative messages and errors.
- **Validation Checks**: Ensures critical operations, like updating an invoice's status, have necessary data (e.g., `invoice.id`).

## 9. Angular Specifics

- **Reactive Forms**: Utilizes `FormBuilder` and `FormGroup` to manage form state and validation.
- **Observables**: Subscribes to observables returned by service methods to handle asynchronous data fetching and processing.
- **ViewChild**: Accesses template references for managing modal dialogs.

## Summary

The `InvoiceListComponent` serves as a comprehensive interface for managing invoices within the application. It provides functionalities to:

- **Display** a list of invoices.
- **Add** new invoices via a modal form.
- **Process** invoice files using OCR to extract data.
- **Update** the status of invoices.
- **Delete** invoices as needed.

By leveraging Angular's reactive forms, dependency injection, and service-based architecture, the component ensures a responsive and maintainable codebase. Additionally, the use of modal dialogs enhances the user experience by providing seamless interactions for adding and reviewing invoices.