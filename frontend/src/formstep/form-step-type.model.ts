export enum FormStepType {
  BOSS = 'رئیس مستقیم',

  USER = 'کاربر',

//   ROLE = 'گروه',
//
  BACK_TO_START = 'برگشت به درخواست دهنده',

  BACK_TO_PREV = 'برگشت به مرحله قبل',
}
export const formStepTypeChoices = Object.entries(FormStepType).map(([key, value]) => ({
  id: key,   // The value to store
  name: value    // The display text
}));
// export const formStepTypeChoices = Object.values(FormStepType).map((role) => ({
//   id: role,
//   name: role,
// }));