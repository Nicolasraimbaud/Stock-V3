# Invoice Form Explanation

The `invoice-form` component in the Angular application is designed to handle the uploading of invoice documents and extracting data from them using Optical Character Recognition (OCR). Here's a detailed explanation of the component:

## Component Logic (`invoice-form.component.ts`)

### Imports
The component imports necessary modules from Angular, such as `Component`, `EventEmitter`, `FormGroup`, `FormBuilder`, `HttpClient`, and others.

### Component Decorator
The `@Component` decorator is used to define the component's selector, template, and styles. It also specifies that the component should be standalone and imports `ReactiveFormsModule`, `FormsModule`, and `CommonModule`.

### Outputs
The component has an output property `ocrResults` which is an `EventEmitter` that emits the results of the OCR process.

### Properties
- `invoiceForm`: A `FormGroup` object that holds the form controls for the invoice form.
- `selectedFile`: A property to store the file selected by the user for uploading.
- `isProcessing`: A boolean flag to indicate if the form is currently processing a file.
- `currentStep`: A number to track the current step in the process (0 for initial, 1 for uploading, 2 for processing, 3 for completion).
- `uploadProgress`: A number to track the progress of the file upload.

### Methods
- `onFileSelected(event: Event)`: A method that is called when a file is selected by the user. It updates the `selectedFile` property.
- `onSubmit()`: A method that is called when the form is submitted. It checks if a file is selected, then starts the processing by sending the file to the backend using `HttpClient`. It also sends additional form data like supplier and email. The method handles the progress of the upload and emits the OCR results once the processing is complete.

The component uses `HttpClient` to send a POST request to the backend API at `http://localhost:8080/api/ocr/read-file` with the selected file and form data. The backend is expected to process the file using OCR and return the results, which are then emitted by the `ocrResults` output.

## User Interface (`invoice-form.component.html`)

The UI for the `invoice-form` component is defined in `invoice-form.component.html`. Here's a breakdown of the UI:

### Form Container
The form is wrapped in a `div` with a class `form-container`.

### Form
The form is defined using Angular's reactive forms. It binds to the `invoiceForm` FormGroup and listens for the `ngSubmit` event, which triggers the `onSubmit()` method.

### Form Grid
The form fields are organized in a grid layout using a `div` with a class `form-grid`.

### Form Groups
- **Supplier**: A text input field for the supplier's name.
- **Email**: An email input field for the supplier's email address.
- **File Upload**: An input field for uploading a PDF file. It includes a label with a PDF icon and a placeholder for the selected file's name.

### Progress Section
This section is displayed when `isProcessing` is true. It shows a series of steps to indicate the progress of the file processing:
- **Chargement (Loading)**: Shows the upload progress.
- **OCR**: Indicates the Optical Character Recognition step.
- **Extraction**: Shows the data extraction step.

### Form Actions
A button to submit the form. The button's text and icon change based on the `isProcessing` flag.

The form uses Font Awesome icons for visual elements like the PDF icon and the spinner during processing. The UI is designed to be responsive and visually appealing, guiding the user through the process of uploading an invoice and extracting data from it.

The form's structure and the use of Angular's reactive forms make it easy to handle form validation and data binding. The progress section provides a clear visual indication of the processing steps, enhancing the user experience.