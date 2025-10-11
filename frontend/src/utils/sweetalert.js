import Swal from 'sweetalert2';

// Tema retro untuk SweetAlert2
const retroTheme = Swal.mixin({
  customClass: {
    container: 'pgm-swal-container',
    popup: 'pgm-swal-popup',
    header: 'pgm-swal-header',
    title: 'pgm-swal-title',
    closeButton: 'pgm-swal-close',
    icon: 'pgm-swal-icon',
    image: 'pgm-swal-image',
    content: 'pgm-swal-content',
    input: 'pgm-swal-input',
    actions: 'pgm-swal-actions',
    confirmButton: 'pgm-swal-confirm',
    cancelButton: 'pgm-swal-cancel',
    footer: 'pgm-swal-footer'
  },
  buttonsStyling: false,
  backdrop: `
    rgba(68, 48, 37, 0.8)
  `,
  allowOutsideClick: false,
  showClass: {
    popup: 'animate__animated animate__fadeIn animate__faster'
  },
  hideClass: {
    popup: 'animate__animated animate__fadeOut animate__faster'
  }
});

// Success alert dengan tema retro
export const showSuccess = (title, text = '') => {
  return retroTheme.fire({
    title: title,
    text: text,
    icon: 'success',
    confirmButtonText: 'GROOVY!',
    timer: 3000,
    timerProgressBar: true
  });
};

// Error alert dengan tema retro
export const showError = (title, text = '') => {
  return retroTheme.fire({
    title: title,
    text: text,
    icon: 'error',
    confirmButtonText: 'GOT IT!',
  });
};

// Warning alert dengan tema retro
export const showWarning = (title, text = '') => {
  return retroTheme.fire({
    title: title,
    text: text,
    icon: 'warning',
    confirmButtonText: 'OKAAAY!',
  });
};

// Info alert dengan tema retro
export const showInfo = (title, text = '') => {
  return retroTheme.fire({
    title: title,
    text: text,
    icon: 'info',
    confirmButtonText: 'FAR OUT!',
  });
};

// Konfirmasi dengan tema retro
export const showConfirm = (title, text = '', confirmText = 'YEAH!', cancelText = 'NAH...') => {
  return retroTheme.fire({
    title: title,
    text: text,
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
  });
};

// Loading alert dengan tema retro
export const showLoading = (title = 'LOADING...', text = 'Please wait a moment') => {
  return retroTheme.fire({
    title: title,
    text: text,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
};

// Close all popups
export const closePopup = () => {
  Swal.close();
};

// Toast notification dengan tema retro
export const showToast = (title, icon = 'success', position = 'top-end', timer = 3000) => {
  const Toast = Swal.mixin({
    toast: true,
    position: position,
    showConfirmButton: false,
    timer: timer,
    timerProgressBar: true,
    customClass: {
      popup: 'pgm-swal-toast',
      title: 'pgm-swal-toast-title',
      icon: 'pgm-swal-toast-icon',
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });
  
  return Toast.fire({
    icon: icon,
    title: title
  });
};
