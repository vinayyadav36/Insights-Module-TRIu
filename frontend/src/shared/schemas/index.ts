// Basic simple schemas and validation functions can be added here
export const isEmailValid = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidSlug = (slug: string) => {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
};

export const isValidRole = (role: string) => {
  return role === 'admin' || role === 'user';
};
