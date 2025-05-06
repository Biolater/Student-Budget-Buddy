export type BudgetErrorType = {
    name: 'BudgetValidationError' | 'BudgetError';
    message: string;
}

export const createBudgetValidationError = (message: string): BudgetErrorType => ({
    name: 'BudgetValidationError',
    message
});

export const createBudgetError = (message: string): BudgetErrorType => ({
    name: 'BudgetError',
    message
}); 