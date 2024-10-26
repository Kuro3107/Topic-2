export const setUserRole = (role) => {
  localStorage.setItem('userRole', role);
};

export const getUserRole = () => {
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  console.log("UserInfo from localStorage:", userInfo); // Thêm dòng này
  if (userInfo && userInfo.roleId) {
    switch (userInfo.roleId) {
      case 1:
        return 'admin';
      case 2:
        return 'sales';
      case 3:
        return 'consulting';
      case 4:
        return 'delivery';
      case 5:
        return 'customer';
      default:
        return null;
    }
  }
  return null;
};

export const clearUserRole = () => {
  localStorage.removeItem('userInfo');
};
