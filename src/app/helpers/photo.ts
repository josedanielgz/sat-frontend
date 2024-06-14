import { DomSanitizer } from '@angular/platform-browser';

const blobFile = async ($event: any, sanitizer: DomSanitizer) =>
  new Promise((resolve, reject) => {
    try {
      const unsafeImg = window.URL.createObjectURL($event);
      const image = sanitizer.bypassSecurityTrustUrl(unsafeImg);
      const reader = new FileReader();
      reader.readAsDataURL($event);
      reader.onload = () => {
        resolve({
          blob: $event,
          image,
          base: reader.result,
        });
      };
      reader.onerror = (error) => {
        resolve({
          blob: $event,
          image,
          base: null,
        });
      };
    } catch (e) {
      return null;
    }
  });

export { blobFile };
