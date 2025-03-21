/* This is the data the Signin_query.jsx draws from. Will be deprecated once backend is connected */
export const SignInQuery = [
  {
    Name: "John Cena",
    Role: "Veterinarian",
    Email: "JohnCena1@yahoo.com",
  },
  {
    Name: "Jeff Bezos",
    Role: "Zookeeper",
    Email: "BeffJezos@gmail.com",
  },
  {
    Name: "Mark Zuckerberg",
    Role: "Admin",
    Email: "MarkyZ@bing.com",
  },
  {
    Name: "Will Smith",
    Role: "Security",
    Email: "smith23@gmail.com",
  },
  {
    Name: "Jacob Peterson",
    Role: "Trainer",
    Email: "jacob5@hotmail.com",
  },
  {
    Name: "Dustin Hoffman",
    Role: "Maintenance",
    Email: "dustin68@bing.com",
  },
];

/**
* Function to get unique roles for dropdowns
*/
export const getUniqueRoles = () => {
const uniqueRoles = [...new Set(SignInQuery.map((entry) => entry.Role))];
return { uniqueRoles };
};

export default SignInQuery;
