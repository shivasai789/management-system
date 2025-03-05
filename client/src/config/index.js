export const loginFormControls = [
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
  ];

  export const registerFormControls = [
    {
      name: "username",
      label: "User Name",
      placeholder: "Enter your username",
      componentType: "input",
      type: "text",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Enter your email",
      componentType: "input",
      type: "email",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Enter your password",
      componentType: "input",
      type: "password",
    },
    { 
    label: "Role",
    name: "role",
    componentType: "select",
    options: [
      { id: "Operator", label: "Operator" },
      { id: "Manager", label: "Manager" },
    ],
  },
  { 
    label: "Department",
    name: "department",
    componentType: "select",
    options: [
      { id: "Assembly", label: "Assembly" },
      { id: "Quality Control", label: "Quality Control" },
    ],
  },
  ];

  export const headerMenuItemsForOperator = [
    {
      id: "home",
      label: "Home",
      path: "/home",
    },
    {
      id: "orders",
      label: "Order",
      path: "/orders",
    },
  ];

  export const headerMenuItemsForManager = [
    {
      id: "home",
      label: "Home",
      path: "/home",
    },
    {
      id: "orders",
      label: "Order",
      path: "/orders",
    },
    {
      id: "register",
      label: "Register Operator",
      path: "/register",
    },
  ];