import { StepperNewAppointment, AppointmentManagement, MyAppointments, CreatedAppointment } from "../pages";

export const routes = [
  {
    path: "/",
    component: <MyAppointments />,
    exact: true,
    protected: false
  },
  {
    path: "/new-appointment",
    component: <StepperNewAppointment />,
    exact: false,
    protected: false
  },
  {
    path: "/created-appointment",
    component: <CreatedAppointment />,
    exact: true,
    protected: false
  }
  // {
  //   path: "/admin",
  //   component: <AppointmentManagement />,
  //   exact: true,
  //   protected: true
  // },
];
