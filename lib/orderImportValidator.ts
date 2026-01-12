export interface ValidationError {
  row: number;
  field: string;
  value: any;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export function validateOrderRow(row: Record<string, any>, rowNumber: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Total amount is required and must be a number
  if (!row.total_amount && row.total_amount !== 0) {
    errors.push({
      row: rowNumber,
      field: 'total_amount',
      value: row.total_amount,
      message: 'Total amount is required',
    });
  } else if (isNaN(parseFloat(row.total_amount))) {
    errors.push({
      row: rowNumber,
      field: 'total_amount',
      value: row.total_amount,
      message: 'Total amount must be a valid number',
    });
  }

  // Currency validation (should be 3-letter code)
  if (row.currency && row.currency.length !== 3) {
    errors.push({
      row: rowNumber,
      field: 'currency',
      value: row.currency,
      message: 'Currency must be a 3-letter code (e.g., USD, CAD, EUR)',
    });
  }

  // Email validation if provided
  if (row.customer_email && !validateEmail(row.customer_email)) {
    errors.push({
      row: rowNumber,
      field: 'customer_email',
      value: row.customer_email,
      message: 'Invalid email format',
    });
  }

  // Quantity must be positive if provided
  if (row.item_quantity !== undefined && row.item_quantity !== null) {
    const qty = parseInt(row.item_quantity);
    if (isNaN(qty) || qty < 1) {
      errors.push({
        row: rowNumber,
        field: 'item_quantity',
        value: row.item_quantity,
        message: 'Item quantity must be a positive number',
      });
    }
  }

  // Price must be non-negative if provided
  if (row.item_price !== undefined && row.item_price !== null) {
    const price = parseFloat(row.item_price);
    if (isNaN(price) || price < 0) {
      errors.push({
        row: rowNumber,
        field: 'item_price',
        value: row.item_price,
        message: 'Item price must be a valid non-negative number',
      });
    }
  }

  return errors;
}

export function validateImportData(data: Record<string, any>[]): ValidationResult {
  const errors: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowErrors = validateOrderRow(row, index + 1);
    errors.push(...rowErrors);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function detectDuplicates(data: Record<string, any>[]): Map<string, number[]> {
  const duplicates = new Map<string, number[]>();
  const seen = new Map<string, number>();

  data.forEach((row, index) => {
    // Check for duplicate order numbers
    if (row.order_number) {
      const orderNumber = row.order_number.toString().toLowerCase();
      if (seen.has(orderNumber)) {
        const firstIndex = seen.get(orderNumber)!;
        if (!duplicates.has(orderNumber)) {
          duplicates.set(orderNumber, [firstIndex]);
        }
        duplicates.get(orderNumber)!.push(index);
      } else {
        seen.set(orderNumber, index);
      }
    }
  });

  return duplicates;
}
