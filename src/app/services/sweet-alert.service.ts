import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  constructor() { }

  afterUpdateSuccess() {
    const toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    return toast({
      type: 'success',
      title: 'Record saved successfully'
    });
  }
}
