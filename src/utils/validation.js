export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.toString().trim().length > 0;
};

export const validateAge = (age) => {
  const numAge = parseInt(age);
  return !isNaN(numAge) && numAge >= 0 && numAge <= 30;
};

export const validateWeight = (weight) => {
  const numWeight = parseFloat(weight);
  return !isNaN(numWeight) && numWeight > 0 && numWeight <= 20;
};