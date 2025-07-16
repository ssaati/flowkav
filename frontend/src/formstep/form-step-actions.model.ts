export enum FormStepActions {

  ASSIGN = 'ارجاع',
  BACK_TO_START = 'برگشت به درخواست دهنده',
  BACK_TO_PREV = 'برگشت به مرحله قبل',
}
export const formStepActionChoices = Object.values(FormStepActions).map((role) => ({
  id: role,
  name: role,
}));