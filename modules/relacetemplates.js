module.exports = (tem, data) => {
  let template = tem.replace(/{%IMAGE%}/g, data.image);
  template = template.replace(/{%PRICE%}/g, data.price);
  template = template.replace(/{%QUANTITY%}/g, data.quantity);
  template = template.replace(/{%NUTRIENT%}/g, data.nutrients);
  template = template.replace(/{%PRODUCTNAME%}/g, data.productName);
  template = template.replace(/{%DESCRIPTION%}/g, data.description);
  template = template.replace(/{&ID&}/g, data.id);

  if (!data.organic)
    template = template.replace(/{%NOT_ORGANIC%}/g, "not-organic");

  return template;
};
