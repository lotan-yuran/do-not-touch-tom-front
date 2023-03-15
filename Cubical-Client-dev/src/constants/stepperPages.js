export const PREFIX = "new-appointment";
export const SCHEDULE = "schedule";
export const PARTIAL_SCHEDULE = "partial";
export const GUIDELINES = "guidelines";
export const SAVED = "saved";

export const pagesInOrder = [
  {
    isDisplayButtonNext: true,
    isDisplayButtonBack: true,
    back: { func: "replace", to: "/" },
    next: { func: "push", to: `/${PREFIX}/${SCHEDULE}` }
  },
  {
    isDisplayButtonNext: true,
    isDisplayButtonBack: true,
    back: { func: "replace", to: `/${PREFIX}` },
    next: { func: "replace", to: `/${PREFIX}/${GUIDELINES}` }
  },
  {
    isDisplayButtonNext: true,
    isDisplayButtonBack: true,
    back: { func: "replace", to: `/${PREFIX}/${SCHEDULE}` },
    next: { func: "push", to: `/${PREFIX}/${PARTIAL_SCHEDULE}` }
  },
  {
    isDisplayButtonNext: false,
    isDisplayButtonBack: false,
    back: { func: "push", to: `/${PREFIX}/${SCHEDULE}` },
    next: { func: "push", to: `/${PREFIX}/${SAVED}` }
  },
  {
    isDisplayButtonNext: false,
    isDisplayButtonBack: false,
    back: { func: "push", to: `/${PREFIX}` },
    next: { func: "push", to: "/" }
  }
];
