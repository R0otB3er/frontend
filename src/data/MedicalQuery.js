/* This is the data the Medical_query.jsx draws from. Will be deprecated once backend is connected */
export const MedicalQuery = [
  {
    Record_ID: "234456425",
    Animal_ID: "dsfgdfhds3",
    Employee_ID: "234234",
    Checkup_Date: "02/14/2024",
    Diagnosis: "Hypothermia",
    Treatment: "Ongoing",
  },
  {
    Record_ID: "456354745",
    Animal_ID: "abc123xyz",
    Employee_ID: "236354",
    Checkup_Date: "03/10/2024",
    Diagnosis: "Pneumonia",
    Treatment: "Finished",
  },
  {
    Record_ID: "867856785",
    Animal_ID: "lmno456def",
    Employee_ID: "546784",
    Checkup_Date: "04/22/2024",
    Diagnosis: "Fever",
    Treatment: "Not Yet Started",
  },
  {
    Record_ID: "564584544",
    Animal_ID: "qwerty789",
    Employee_ID: "967456",
    Checkup_Date: "05/05/2024",
    Diagnosis: "Flu",
    Treatment: "Ongoing",
  },
  {
    Record_ID: "768678955",
    Animal_ID: "abc123xyz",
    Employee_ID: "446323",
    Checkup_Date: "06/18/2024",
    Diagnosis: "Headache",
    Treatment: "Finished",
  },
  {
    Record_ID: "475682452",
    Animal_ID: "lmno456def",
    Employee_ID: "343685",
    Checkup_Date: "07/30/2024",
    Diagnosis: "Hives",
    Treatment: "Not Yet Started",
  },
  {
    Record_ID: "584923678",
    Animal_ID: "zxy987poi",
    Employee_ID: "872346",
    Checkup_Date: "08/15/2024",
    Diagnosis: "Dehydration",
    Treatment: "Ongoing",
  },
  {
    Record_ID: "692184723",
    Animal_ID: "kji876vbn",
    Employee_ID: "128374",
    Checkup_Date: "09/05/2024",
    Diagnosis: "Fracture",
    Treatment: "Not Yet Started",
  },
  {
    Record_ID: "813472390",
    Animal_ID: "mnb543vcx",
    Employee_ID: "903456",
    Checkup_Date: "10/12/2024",
    Diagnosis: "Infection",
    Treatment: "Finished",
  },
  {
    Record_ID: "904563218",
    Animal_ID: "tuv789qwe",
    Employee_ID: "764231",
    Checkup_Date: "11/20/2024",
    Diagnosis: "Allergic Reaction",
    Treatment: "Ongoing",
  },
];

/**
 * Function to get unique values for dropdowns
 * ✅ Ensures `Animal_ID` and `Diagnosis` values are unique
 */
export const getUniqueMedicalValues = () => {
  const uniqueAnimalIDs = [...new Set(MedicalQuery.map((entry) => entry.Animal_ID))];
  const uniqueDiagnoses = [...new Set(MedicalQuery.map((entry) => entry.Diagnosis))];

  return { uniqueAnimalIDs, uniqueDiagnoses };
};

export default MedicalQuery;
