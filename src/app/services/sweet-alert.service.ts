import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class SweetAlertService {

  toast;

  constructor() {
    this.toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  fieldRequiredError() {
    return this.toast({
      type: 'error',
      title: 'One or more required criterias is empty! Complete required details before subitting the form'
    });
  }

  confirmUpdate() {
    return swal({
      title: 'Record Update!',
      text: 'Are you sure of the record supplied?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    });
  }

  afterUpdateSuccess() {
    return this.toast({
      type: 'success',
      title: 'Record saved successfully'
    });
  }

  confirmDelete() {
    return swal({
      title: 'Record Delete!',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    });
  }

  afterDeleteSuccess() {
    return this.toast({
      type: 'success',
      title: 'Record deleted successfully'
    });
  }
}
