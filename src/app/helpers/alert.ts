import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 2000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  },
});

const showAlert = (icon, title) =>
  Toast.fire({
    icon,
    title,
  });

const showQuestion = (title, text) =>
  Swal.fire({
    title,
    text,
    icon: 'warning',
    confirmButtonColor: '#14c25a',
    showDenyButton: true,
    denyButtonColor: '#d33',
    denyButtonText: 'No',
    confirmButtonText: 'Si',
  });

export { showAlert, showQuestion };
