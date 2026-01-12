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

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePhone(phone: string): boolean {
  // Basic phone validation - at least 10 digits
  const digitsOnly = phone?.replace(/\D/g, '') || '';
  return digitsOnly.length >= 10;
}

export function validateCustomerRow(row: Record<string, any>, rowNumber: number): ValidationError[] {
  const errors: ValidationError[] = [];

  // Email is required
  if (!row.email || row.email.trim() === '') {
    errors.push({
      row: rowNumber,
      field: 'email',
      value: row.email,
      message: 'Email is required',
    });
  } else if (!validateEmail(row.email)) {
    errors.push({
      row: rowNumber,
      field: 'email',
      value: row.email,
      message: 'Invalid email format',
    });
  }

  // Validate phone if provided
  if (row.phone && !validatePhone(row.phone)) {
    errors.push({
      row: rowNumber,
      field: 'phone',
      value: row.phone,
      message: 'Invalid phone number format',
    });
  }

  // Validate client_type
  if (row.client_type && !['individual', 'organization'].includes(row.client_type)) {
    errors.push({
      row: rowNumber,
      field: 'client_type',
      value: row.client_type,
      message: 'client_type must be "individual" or "organization"',
    });
  }

  // If company_name is provided but client_type is not, auto-set it
  if (row.company_name && !row.client_type) {
    row.client_type = 'organization';
  }

  return errors;
}

export function validateImportData(
  data: Record<string, any>[],
  options: { requireEmail?: boolean } = {}
): ValidationResult {
  const allErrors: ValidationError[] = [];

  data.forEach((row, index) => {
    const rowErrors = validateCustomerRow(row, index + 1);
    allErrors.push(...rowErrors);
  });

  return {
    valid: allErrors.length === 0,
    errors: allErrors,
  };
}

export function detectDuplicates(data: Record<string, any>[]): Map<string, number[]> {
  const emailMap = new Map<string, number[]>();

  data.forEach((row, index) => {
    const email = row.email?.toLowerCase().trim();
    if (email) {
      if (!emailMap.has(email)) {
        emailMap.set(email, []);
      }
      emailMap.get(email)!.push(index + 1);
    }
  });

  // Filter to only duplicates
  const duplicates = new Map<string, number[]>();
  for (const [email, rows] of emailMap.entries()) {
    if (rows.length > 1) {
      duplicates.set(email, rows);
    }
  }

  return duplicates;
}
