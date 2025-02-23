export const generateBBCode = (
  data: string,
  inputs: { [key: string]: string }
): string => {
  let updatedBBCode = data;

  Object.keys(inputs).forEach((name) => {
    const value = inputs[name];

    const inputTagRegex = new RegExp(
      `\\[input name=${name}\\](.*?)\\[\\/input\\]`,
      "g"
    );

    updatedBBCode = updatedBBCode.replace(inputTagRegex, value);
  });

  return updatedBBCode;
};
