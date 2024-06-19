import { CanDeactivateFn } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { ConfirmService } from '../_services/confirm.service';
import { inject } from '@angular/core';

export const preventUnsavedChangesGuard: CanDeactivateFn<MemberEditComponent> = (component, currentRoute, currentState, nextState) => {

  const confirmService = inject(ConfirmService);
  if(component.editForm?.dirty){
    return confirmService.confirm(); //'Are you sure want to exit? Any unsaved changes will be lost' 
  }
  return true;
};
